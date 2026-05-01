import type { SiteConfig } from "../../config/site.config";
import { tagPath } from "../../shared/path";

type TagBadgeProps = {
  siteConfig: SiteConfig;
  tag: string;
};

export const TagBadge = ({ siteConfig, tag }: TagBadgeProps) => (
  <a class="tag-badge" href={tagPath(siteConfig, tag)}>
    {tag}
  </a>
);
