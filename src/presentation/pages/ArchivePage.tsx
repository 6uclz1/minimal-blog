import type { SiteConfig } from "../../config/site.config";
import type { ArchiveMonth } from "../../content/usecases/buildContentIndex";
import { postPath } from "../../shared/path";
import { DateTime } from "../components/DateTime";

type ArchivePageProps = {
  archiveMonths: ArchiveMonth[];
  siteConfig: SiteConfig;
};

export const ArchivePage = ({
  archiveMonths,
  siteConfig,
}: ArchivePageProps) => (
  <section class="page-section">
    <div class="page-heading">
      <p class="eyebrow">Archive</p>
      <h1>All posts by month</h1>
    </div>
    <div class="archive-list">
      {archiveMonths.map((archiveMonth) => (
        <section class="archive-month" key={archiveMonth.month}>
          <h2>{archiveMonth.label}</h2>
          <ul>
            {archiveMonth.posts.map((post) => (
              <li key={post.id}>
                <a href={postPath(siteConfig, post.slug)}>{post.title}</a>
                <DateTime date={post.publishedAt} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </section>
);
