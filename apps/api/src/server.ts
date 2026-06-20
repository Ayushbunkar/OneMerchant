import app from "./app.js";
import { env } from "./config/env.js";
import { startWorkers } from "./workers/index.js";

const server = app.listen(env.PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   🚀 OneMerchant API Server                       ║
  ║                                                   ║
  ║   Port:        ${env.PORT}                             ║
  ║   Environment: ${env.NODE_ENV.padEnd(18)}        ║
  ║   Health:      http://localhost:${env.PORT}/health      ║
  ║   API Base:    http://localhost:${env.PORT}/api/v1      ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
  `);

  // Start BullMQ workers
  startWorkers();
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
