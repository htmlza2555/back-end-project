import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { IContentHandler } from ".";
import { IContentDto, ICreateContentDto } from "../dto/content";
import { IContentRepository, ICreateContent } from "../repositories";
import { RequestHandler } from "express";
import { IErrorDto } from "../dto/error";
import { AuthStatus } from "../middleware/jwt";
import oembedVideo from "../utils/oembed";

export default class ContentHandler implements IContentHandler {
  constructor(private repo: IContentRepository) {}

  public createContent: RequestHandler<
    {},
    IContentDto | IErrorDto,
    ICreateContentDto,
    undefined,
    AuthStatus
  > = async (req, res) => {
    const { rating, videoUrl, comment } = req.body;
    if (videoUrl.length === 0 || typeof videoUrl !== "string") {
      throw new Error("invalid videoUrl");
    }
    if (comment === undefined || typeof comment !== "string") {
      throw new Error("invalid comment");
    }
    if (rating > 5 || rating < 0) {
      throw new Error("rating is out of range 0-5");
    }

    try {
      const { authorName, authorUrl, thumbnailUrl, title } = await oembedVideo(
        videoUrl
      );
      const {
        User: { registeredAt, ...userInfo },
        createdAt,
        updatedAt,
        ...contentInfo
      } = await this.repo.createContent(
        {
          videoUrl,
          comment,
          rating,
          creatorName: authorName,
          creatorUrl: authorUrl,
          thumbnailUrl: thumbnailUrl,
          videoTitle: title,
        },
        res.locals.user.id
      );

      return res
        .status(201)
        .json({
          ...contentInfo,
          postedBy: {
            ...userInfo,
            registeredAt: registeredAt.toISOString(),
          },
          createdAt: createdAt.toISOString(),
          updatedAt: updatedAt.toISOString(),
        })
        .end();
    } catch (error) {
      console.error(error);

      if (error instanceof URIError)
        return res.status(400).json({ message: error.message }).end();

      res.status(500).json({ message: "Internal Server Error" }).end();
    }
  };
}
