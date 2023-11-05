import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { IContentHandler } from ".";
import { IContentDto, ICreateContentDto } from "../dto/content";
import { IContentRepository, ICreateContent } from "../repositories";
import { RequestHandler } from "express";
import { IErrorDto } from "../dto/error";
import { AuthStatus } from "../middleware/jwt";
import oembedVideo from "../utils/oembed";
import contentMapper from "../utils/content.mapper";

export default class ContentHandler implements IContentHandler {
  constructor(private repo: IContentRepository) {}

  public createContent: IContentHandler["createContent"] = async (req, res) => {
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

  public getContentById: IContentHandler["getContentById"] = async (
    req,
    res
  ) => {
    try {
      const id = Number(req.params.id);
      const result = await this.repo.getContentById(id);
      const contentResponse = contentMapper(result);
      return res.status(200).json(contentResponse).end();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message }).end();
      }
      return res.status(500).json({ message: "internal server error" }).end();
    }
  };

  public getAllContents: IContentHandler["getAllContents"] = async (
    req,
    res
  ) => {
    const result = await this.repo.getAllContents();
    const contentResponse = result.map((content) => {
      return contentMapper(content);
    });

    return res.status(200).json(contentResponse).end();
  };

  public updateContentById: IContentHandler["updateContentById"] = async (
    req,
    res
  ) => {
    try {
      const userId = res.locals.user.id;
      const contentId = Number(req.params.id);
      const { comment, rating } = req.body;
      if (comment === undefined || typeof comment !== "string") {
        throw new Error("invalid comment");
      }
      if (
        rating > 5 ||
        rating < 0 ||
        rating === undefined ||
        typeof rating !== "number"
      ) {
        throw new Error("rating is out of range 0-5");
      }

      const result = await this.repo.updateContentById(contentId, {
        comment,
        rating,
      });
      if (userId !== result.User.id) throw new Error("OwnerId is invalid");
      const contentResponse = contentMapper(result);
      return res.status(200).json(contentResponse).end();
    } catch (error) {
      console.error(error);
      if (error instanceof PrismaClientKnownRequestError)
        return res.status(400).json({ message: error.message }).end();

      return res.status(500).json({ message: "Internal server error" }).end();
    }
  };
}
