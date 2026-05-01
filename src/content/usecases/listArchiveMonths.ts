import type { ArchiveMonth, ContentIndex } from "./buildContentIndex";

export const listArchiveMonths = (index: ContentIndex): ArchiveMonth[] =>
  index.archiveMonths;
