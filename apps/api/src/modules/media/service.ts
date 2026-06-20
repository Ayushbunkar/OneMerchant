import cloudinary from "../../config/cloudinary.js";
import { prisma } from "../../config/database.js";
import { AppError } from "../../middleware/errorHandler.js";
import { Readable } from "stream";

export const mediaService = {
  async upload(tenantId: string, file: Express.Multer.File, folder?: string) {
    if (!file) throw new AppError("No file provided", 400, "NO_FILE");

    const uploadFolder = `${tenantId}/${folder || "general"}`;

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: uploadFolder, resource_type: "auto", quality: "auto", fetch_format: "auto" },
        (error, result) => {
          if (error) reject(new AppError("Upload failed: " + error.message, 500, "UPLOAD_FAILED"));
          else resolve(result);
        }
      );
      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });

    const media = await prisma.media.create({
      data: {
        tenantId,
        publicId: result.public_id,
        secureUrl: result.secure_url,
        resourceType: result.resource_type,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        folder: uploadFolder,
      },
    });

    return media;
  },

  async delete(tenantId: string, mediaId: string) {
    const media = await prisma.media.findFirst({ where: { id: mediaId, tenantId } });
    if (!media) throw new AppError("Media not found", 404, "NOT_FOUND");

    await cloudinary.uploader.destroy(media.publicId);
    await prisma.media.delete({ where: { id: mediaId } });
  },

  async list(tenantId: string, params: { page?: number; limit?: number; folder?: string }) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 50);
    const where: any = { tenantId };
    if (params.folder) where.folder = { contains: params.folder };
    const [items, total] = await Promise.all([
      prisma.media.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.media.count({ where }),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 } };
  },
};
