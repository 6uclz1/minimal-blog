import type { ContentRepository } from "../ports/ContentRepository";
import { fixturePosts } from "./fixturePosts";

export class FixtureContentRepository implements ContentRepository {
  async listPosts() {
    return fixturePosts;
  }
}
