"""
Sentiment Analyser — keyword-based scoring with optional OpenAI enhancement.

Provides fast, deterministic sentiment scores for text inputs using a
curated keyword dictionary.  When an OpenAI API key is configured,
``analyse_with_llm`` can be used for more nuanced, context-aware scoring.
"""

import logging
import re
from typing import Any, Dict, List, Optional

from openai import AsyncOpenAI

from app.core.config import get_settings

logger = logging.getLogger(__name__)

# ── Keyword dictionaries ───────────────────────────────────────

_POSITIVE_WORDS = {
    "good", "great", "excellent", "amazing", "wonderful", "fantastic",
    "awesome", "love", "best", "happy", "satisfied", "perfect",
    "impressed", "recommend", "quality", "fast", "quick", "helpful",
    "friendly", "beautiful", "superb", "outstanding", "brilliant",
    "delighted", "pleased", "thank", "thanks", "appreciate",
    "reliable", "smooth", "easy", "convenient", "affordable",
    "fresh", "clean", "premium", "top", "genuine", "value",
}

_NEGATIVE_WORDS = {
    "bad", "terrible", "horrible", "awful", "worst", "hate", "poor",
    "disappointed", "disappointing", "slow", "broken", "defective",
    "rude", "unhelpful", "expensive", "overpriced", "cheap", "fake",
    "fraud", "scam", "waste", "refund", "return", "damaged", "delay",
    "delayed", "missing", "wrong", "error", "complaint", "issue",
    "problem", "angry", "frustrated", "useless", "pathetic",
    "never", "unacceptable", "disgusting", "regret", "lousy",
}

_INTENSIFIERS = {"very", "really", "extremely", "absolutely", "totally", "so"}
_NEGATORS = {"not", "no", "never", "neither", "nor", "n't", "don't", "doesn't", "didn't", "won't", "can't"}


class SentimentAnalyzer:
    """Analyse text sentiment using keyword scoring and optional LLM."""

    def __init__(self) -> None:
        """Initialise the analyser and optionally set up OpenAI."""
        settings = get_settings()
        self._openai_available = settings.openai_available
        self._model = settings.AI_MODEL
        self._client: Optional[AsyncOpenAI] = None
        if self._openai_available:
            self._client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    # ── Public API ──────────────────────────────────────────────

    async def analyze(
        self,
        texts: List[str],
        use_llm: bool = False,
    ) -> List[Dict[str, Any]]:
        """
        Score sentiment for each text in *texts*.

        Parameters
        ----------
        texts : list[str]
            Input texts to analyse.
        use_llm : bool
            If ``True`` and OpenAI is available, use the LLM for richer analysis.

        Returns
        -------
        list[dict]
            One result per text with keys: text, sentiment, score, confidence.
        """
        if use_llm and self._openai_available and self._client is not None:
            try:
                return await self._analyze_with_llm(texts)
            except Exception as exc:
                logger.warning("LLM sentiment analysis failed, using keywords: %s", exc)

        return [self._keyword_score(t) for t in texts]

    # ── Keyword-based scoring ───────────────────────────────────

    def _keyword_score(self, text: str) -> Dict[str, Any]:
        """
        Score a single text using the keyword dictionaries.

        Returns a dict with sentiment label, numeric score (-1 to 1),
        and confidence (0 to 1).
        """
        words = re.findall(r"[a-z']+", text.lower())
        if not words:
            return {"text": text, "sentiment": "neutral", "score": 0.0, "confidence": 0.3}

        pos_count = 0
        neg_count = 0
        intensity = 1.0

        for i, word in enumerate(words):
            is_negated = i > 0 and words[i - 1] in _NEGATORS
            is_intensified = i > 0 and words[i - 1] in _INTENSIFIERS

            multiplier = 1.5 if is_intensified else 1.0

            if word in _POSITIVE_WORDS:
                if is_negated:
                    neg_count += multiplier
                else:
                    pos_count += multiplier

            elif word in _NEGATIVE_WORDS:
                if is_negated:
                    pos_count += multiplier * 0.5  # "not bad" = slightly positive
                else:
                    neg_count += multiplier

        total = pos_count + neg_count
        if total == 0:
            return {"text": text, "sentiment": "neutral", "score": 0.0, "confidence": 0.3}

        raw_score = (pos_count - neg_count) / total  # -1 to 1
        confidence = min(total / len(words) * 2, 1.0)  # keyword density

        if raw_score > 0.15:
            sentiment = "positive"
        elif raw_score < -0.15:
            sentiment = "negative"
        else:
            sentiment = "neutral"

        return {
            "text": text,
            "sentiment": sentiment,
            "score": round(raw_score, 3),
            "confidence": round(confidence, 3),
        }

    # ── LLM-based scoring ──────────────────────────────────────

    async def _analyze_with_llm(self, texts: List[str]) -> List[Dict[str, Any]]:
        """Use OpenAI to perform nuanced sentiment analysis."""
        results: List[Dict[str, Any]] = []

        # Process in batches of 10
        batch_size = 10
        for i in range(0, len(texts), batch_size):
            batch = texts[i: i + batch_size]
            numbered = "\n".join(f"{j+1}. {t}" for j, t in enumerate(batch))

            prompt = (
                "Analyse the sentiment of each numbered text below. "
                "For each, respond with ONLY a JSON array of objects with keys: "
                "\"index\" (1-based), \"sentiment\" (positive/negative/neutral), "
                "\"score\" (-1.0 to 1.0), \"confidence\" (0.0 to 1.0).\n\n"
                f"{numbered}"
            )

            response = await self._client.chat.completions.create(  # type: ignore[union-attr]
                model=self._model,
                messages=[
                    {"role": "system", "content": "You are a sentiment analysis engine. Return only valid JSON."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.0,
                max_tokens=512,
            )
            content = response.choices[0].message.content or "[]"

            try:
                import json
                parsed = json.loads(content.strip().strip("```json").strip("```"))
                for item in parsed:
                    idx = int(item.get("index", 1)) - 1
                    if 0 <= idx < len(batch):
                        results.append({
                            "text": batch[idx],
                            "sentiment": item.get("sentiment", "neutral"),
                            "score": float(item.get("score", 0)),
                            "confidence": float(item.get("confidence", 0.5)),
                        })
            except Exception as exc:
                logger.warning("Failed to parse LLM sentiment response: %s", exc)
                results.extend(self._keyword_score(t) for t in batch)

        # If we missed any texts, fill with keyword fallback
        analysed_texts = {r["text"] for r in results}
        for t in texts:
            if t not in analysed_texts:
                results.append(self._keyword_score(t))

        return results
