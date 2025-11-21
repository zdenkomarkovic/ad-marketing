"use client";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = "/" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  // Always show first page
  pages.push(1);

  // Show ellipsis or pages near start
  if (showEllipsisStart) {
    pages.push(-1); // -1 represents ellipsis
  } else {
    for (let i = 2; i < Math.min(4, totalPages); i++) {
      pages.push(i);
    }
  }

  // Show pages around current page
  if (currentPage > 3 && currentPage < totalPages - 2) {
    pages.push(currentPage - 1, currentPage, currentPage + 1);
  }

  // Show ellipsis or pages near end
  if (showEllipsisEnd) {
    pages.push(-2); // -2 represents ellipsis
  } else {
    for (let i = Math.max(totalPages - 2, 4); i < totalPages; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
  }

  // Always show last page
  if (!pages.includes(totalPages) && totalPages > 1) {
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-2 mt-8">
      {/* Previous button */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
        >
          ← Prethodna
        </Link>
      ) : (
        <span className="px-4 py-2 border border-border rounded-lg text-muted-foreground cursor-not-allowed">
          ← Prethodna
        </span>
      )}

      {/* Page numbers */}
      <div className="flex gap-2">
        {pages.map((page, idx) => {
          if (page < 0) {
            return (
              <span key={`ellipsis-${idx}`} className="px-4 py-2">
                ...
              </span>
            );
          }

          return (
            <Link
              key={page}
              href={`${basePath}?page=${page}`}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-secondary"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
        >
          Sledeća →
        </Link>
      ) : (
        <span className="px-4 py-2 border border-border rounded-lg text-muted-foreground cursor-not-allowed">
          Sledeća →
        </span>
      )}
    </nav>
  );
}
