import { Link } from "react-router";
import { formatDate } from "~/utils/formatDate";

interface ContentCardProps {
  to: string;
  title: string;
  description: string;
  date?: string;
  readTime?: number;
  tags?: string[];
}

export default function ContentCard({ to, title, description, date, readTime, tags }: ContentCardProps) {
  return (
    <Link
      to={to}
      className="group flex flex-col h-full border border-border rounded-xl p-6 hover:border-primary transition-colors"
    >
      {date && (
        <div className="text-sm text-muted-foreground mb-1">
          <time>
            {formatDate(date)}
          </time>
          {readTime != null && <> · {readTime} min read</>}
        </div>
      )}
      <h2 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground flex-1">{description}</p>
      {tags && tags.length > 0 && (
        <ul className="flex flex-wrap gap-2 list-none p-0 mt-4">
          {tags.map((tag) => (
            <li
              key={tag}
              className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs font-medium"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}
