"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, basePath = "/", onPageChange }: PaginationProps) {
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

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
      // Scroll to top of page smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="flex items-center justify-center gap-1 md:gap-2 mt-8 px-2">
      {/* Previous button */}
      {currentPage > 1 ? (
        onPageChange ? (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-2 md:px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prethodna</span>
          </button>
        ) : (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            className="px-2 md:px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prethodna</span>
          </Link>
        )
      ) : (
        <span className="px-2 md:px-4 py-2 border border-border rounded-lg text-muted-foreground cursor-not-allowed flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prethodna</span>
        </span>
      )}

      {/* Page numbers */}
      <div className="flex gap-0.5 md:gap-2">
        {pages.map((page, idx) => {
          if (page < 0) {
            return (
              <span key={`ellipsis-${idx}`} className="px-1 md:px-4 py-2 hidden sm:inline">
                ...
              </span>
            );
          }

          return onPageChange ? (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-1.5 md:px-4 py-2 border rounded-lg transition-colors text-sm md:text-base min-w-[32px] md:min-w-[44px] text-center ${
                currentPage === page
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-secondary"
              }`}
            >
              {page}
            </button>
          ) : (
            <Link
              key={page}
              href={`${basePath}?page=${page}`}
              className={`px-1.5 md:px-4 py-2 border rounded-lg transition-colors text-sm md:text-base min-w-[32px] md:min-w-[44px] text-center ${
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
        onPageChange ? (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-2 md:px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors flex items-center gap-1"
          >
            <span className="hidden sm:inline">Sledeća</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="px-2 md:px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors flex items-center gap-1"
          >
            <span className="hidden sm:inline">Sledeća</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )
      ) : (
        <span className="px-2 md:px-4 py-2 border border-border rounded-lg text-muted-foreground cursor-not-allowed flex items-center gap-1">
          <span className="hidden sm:inline">Sledeća</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
