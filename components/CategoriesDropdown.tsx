"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Category {
  Id: string;
  Name: string;
  Parent: string;
}

interface CategoriesDropdownProps {
  categories: Category[];
}

export default function CategoriesDropdown({ categories }: CategoriesDropdownProps) {
  // Get ALL parent categories - show everything
  const parentCategories = categories.filter((c) => c.Parent === "*");

  if (parentCategories.length === 0) {
    return null;
  }

  return (
    <div className="opacity-0 group-hover:opacity-100 invisible group-hover:visible absolute left-0 top-full mt-2 bg-white dark:bg-gray-800 border-2 border-primary/20 rounded-xl shadow-2xl z-[9999] min-w-[300px] w-max transition-all">
      <div className="py-3">
        {parentCategories.map((category) => {
          // Show ALL subcategories
          const subcategories = categories.filter((c) => c.Parent === category.Id);
          const hasSubcategories = subcategories.length > 0;

          return (
            <div key={category.Id} className="relative group/category">
              <Link
                href={`/categories/${encodeURIComponent(category.Id)}`}
                className={`flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-primary hover:text-white transition-all ${
                  hasSubcategories ? "pr-2" : ""
                }`}
              >
                <span>{category.Name}</span>
                {hasSubcategories && (
                  <ChevronRight className="w-4 h-4 ml-2" />
                )}
              </Link>

              {/* Nested dropdown for subcategories */}
              {hasSubcategories && (
                <div className="opacity-0 group-hover/category:opacity-100 invisible group-hover/category:visible absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 border-2 border-primary/20 rounded-xl shadow-2xl min-w-[280px] w-max transition-all z-[99999]">
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      {category.Name}
                    </div>
                    {subcategories.map((subcat) => (
                      <Link
                        key={subcat.Id}
                        href={`/categories/${encodeURIComponent(subcat.Id)}`}
                        className="block px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 hover:bg-primary/90 hover:text-white transition-all hover:translate-x-1"
                      >
                        • {subcat.Name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
