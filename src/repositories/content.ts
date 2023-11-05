import { PrismaClient } from "@prisma/client";
import { IContent, IContentRepository, ICreateContent } from ".";
import { DEFAULT_USER_SELECT } from "../const";
import { IUpdateContentDto } from "../dto/content";

export default class ContentRepository implements IContentRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createContent(content: ICreateContent, ownerId: string): Promise<IContent> {
    return this.prisma.content.create({
      data: {
        ...content,
        User: {
          connect: { id: ownerId },
        },
      },
      include: {
        User: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }

  getContentById(id: number): Promise<IContent> {
    return this.prisma.content.findUniqueOrThrow({
      where: { id },
      include: {
        User: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }

  getAllContents(): Promise<IContent[]> {
    return this.prisma.content.findMany({
      include: {
        User: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }

  updateContentById(id: number, content: IUpdateContentDto): Promise<IContent> {
    const updateTime = new Date().toISOString();
    return this.prisma.content.update({
      where: { id },
      data: { ...content, updatedAt: updateTime },
      include: {
        User: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }

  deleteContentById(id: number): Promise<IContent> {
    return this.prisma.content.delete({
      where: { id: id },
      include: {
        User: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }
}
