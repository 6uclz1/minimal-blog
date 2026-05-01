import type { Post } from "../../content/domain/Post";
import { formatDate, formatMachineDate } from "../../shared/date";

type DateTimeProps = {
  date: Post["publishedAt"];
};

export const DateTime = ({ date }: DateTimeProps) => (
  <time dateTime={formatMachineDate(date)}>{formatDate(date)}</time>
);
