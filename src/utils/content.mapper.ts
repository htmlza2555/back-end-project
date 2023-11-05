import { IContentDto } from "../dto/content";
import { IContent } from "../repositories";

export default (content: IContent): IContentDto => {
  const {
    User: { registeredAt, ...userInfo },
    createdAt,
    updatedAt,
    ...contentInfo
  } = content;

  return {
    ...contentInfo,
    postedBy: {
      ...userInfo,
      registeredAt: registeredAt.toISOString(),
    },
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
};
