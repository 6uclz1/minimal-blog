import type { Post } from "../domain/Post";
import type { ContentIndex } from "./buildContentIndex";

export const listPublishedPosts = (index: ContentIndex): Post[] =>
  index.publishedPosts;
