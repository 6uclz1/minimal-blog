import type { Post } from "../domain/Post";

export interface ContentRepository {
  listPosts(): Promise<Post[]>;
}
