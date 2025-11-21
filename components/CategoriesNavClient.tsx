"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface Category {
  Id: string;
  Name: string;
  subcategories: Array<{
    Id: string;
    Name: string;
  }>;
}

interface Props {
  categories: Category[];
}

export default function CategoriesNavClient({ categories }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const HandleScroll = () => {
      if (window.scrollY > 0) setScrolled(true);
      else setScrolled(false);
    };

    document.addEventListener("scroll", HandleScroll);

    return () => {
      document.removeEventListener("scroll", HandleScroll);
    };
  }, []);

  return (
    <nav
      className={`flex justify-center ${
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md"
          : "bg-transparent"
      }  fixed top-20 left-0 right-0 z-[40] transition-colors`}
    >
      <div className="w-[80rem] mx-auto px-4 md:px-8">
        <div className="flex justify-between flex-wrap items-center min-w-full">
          {categories.map((category) => (
            <div key={category.Id} className="group relative">
              <Link
                href={`/categories/${encodeURIComponent(category.Id)}`}
                className="text-sm font-medium text-foreground hover:text-primary whitespace-nowrap px-1 py-2 rounded-md hover:bg-secondary/50 transition-colors inline-flex items-center gap-1"
              >
                {category.Name}
                {category.subcategories.length > 0 && (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Link>

              {/* Dropdown for subcategories */}
              {category.subcategories.length > 0 && (
                <div className="hidden group-hover:block absolute left-0 top-full bg-card border border-border rounded-lg shadow-2xl z-[9999] min-w-[250px]">
                  <div className="py-2">
                    {category.subcategories.map((subcat) => (
                      <Link
                        key={subcat.Id}
                        href={`/categories/${encodeURIComponent(subcat.Id)}`}
                        className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {subcat.Name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
