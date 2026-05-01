import type { ContentIndex, TagGroup } from "./buildContentIndex";

export const listTags = (index: ContentIndex): TagGroup[] => index.tags;
