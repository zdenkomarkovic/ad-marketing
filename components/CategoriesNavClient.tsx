"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

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

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <nav
      className={`flex justify-center ${
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md"
          : "bg-transparent"
      }  fixed top-20 left-0 right-0 z-[40] transition-colors`}
    >
      <div className="w-[80rem] mx-auto px-4 md:px-8">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center justify-between ">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex items-center gap-2 transition-colors px-4 py-2 rounded-md ${
              mobileMenuOpen
                ? "bg-muted text-muted-foreground hover:text-primary"
                : "bg-secondary/50 text-white hover:text-primary"
            }`}
          >
            {mobileMenuOpen ? (
              <>
                <X className="w-5 h-5" />
                <span className="font-medium">Zatvori kategorije</span>
              </>
            ) : (
              <>
                <Menu className="w-5 h-5" />
                <span className="font-medium">Kategorije proizvoda</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border border-border rounded-lg shadow-lg mb-4 overflow-y-auto max-h-[70vh]">
            {categories.map((category) => (
              <div
                key={category.Id}
                className="border-b border-border last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/categories/${encodeURIComponent(category.Id)}`}
                    className="flex-1 px-4 py-1 text-foreground font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.Name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <button
                      onClick={() => toggleCategory(category.Id)}
                      className="px-4  hover:bg-secondary/50 transition-colors"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-foreground transition-transform ${
                          openCategory === category.Id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {category.subcategories.length > 0 &&
                  openCategory === category.Id && (
                    <div className="bg-muted">
                      {category.subcategories.map((subcat) => (
                        <Link
                          key={subcat.Id}
                          href={`/categories/${encodeURIComponent(subcat.Id)}`}
                          className="block px-8 py-1 text-sm text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subcat.Name}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* Desktop Menu - Hidden on Mobile */}
        <div className="hidden md:flex justify-between text-white flex-wrap items-center min-w-full">
          {categories.map((category) => (
            <div key={category.Id} className="group relative">
              <Link
                href={`/categories/${encodeURIComponent(category.Id)}`}
                className="text-xs md:text-sm font-medium hover:text-primary whitespace-nowrap px-0.5 md:px-1 lg:px-2 py-1 md:py-2 rounded-md hover:bg-secondary/50 transition-colors inline-flex items-center gap-0.5 md:gap-1"
              >
                {category.Name}
                {category.subcategories.length > 0 && (
                  <ChevronDown className="w-3 md:w-4 h-3 md:h-4" />
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
