import type { Post } from "../domain/Post";
import type { ContentIndex } from "./buildContentIndex";

export const getPostBySlug = (
  index: ContentIndex,
  slug: string,
): Post | undefined => index.postsBySlug.get(slug);
