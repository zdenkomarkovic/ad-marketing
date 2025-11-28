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
          <div className="md:hidden bg-card border-2 border-primary/20 rounded-xl shadow-2xl mb-4 overflow-y-auto max-h-[70vh] mt-3">
            {categories.map((category) => (
              <div
                key={category.Id}
                className="border-b border-border last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/categories/${encodeURIComponent(category.Id)}`}
                    className="flex-1 px-4 py-3 text-foreground font-semibold text-base hover:bg-primary hover:text-primary-foreground transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.Name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <button
                      onClick={() => toggleCategory(category.Id)}
                      className="px-4 py-3 hover:bg-secondary/50 transition-colors"
                    >
                      <ChevronDown
                        className={`w-5 h-5 text-foreground transition-transform ${
                          openCategory === category.Id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {category.subcategories.length > 0 &&
                  openCategory === category.Id && (
                    <div className="bg-muted/50">
                      {category.subcategories.map((subcat) => (
                        <Link
                          key={subcat.Id}
                          href={`/categories/${encodeURIComponent(subcat.Id)}`}
                          className="block px-8 py-2.5 text-sm text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          • {subcat.Name}
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* Desktop Menu - Hidden on Mobile */}
        <div className="hidden md:flex justify-between text-white flex-wrap items-center min-w-full gap-1">
          {categories.map((category) => (
            <div key={category.Id} className="group relative">
              <Link
                href={`/categories/${encodeURIComponent(category.Id)}`}
                className="text-sm lg:text-base font-semibold hover:text-primary whitespace-nowrap px-2 lg:px-3 py-2 rounded-lg hover:bg-secondary/60 transition-all inline-flex items-center gap-1 border-2 border-transparent hover:border-primary/30"
              >
                {category.Name}
                {category.subcategories.length > 0 && (
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                )}
              </Link>

              {/* Dropdown for subcategories */}
              {category.subcategories.length > 0 && (
                <div className="hidden group-hover:block absolute left-0 top-full mt-1 bg-card border-2 border-primary/20 rounded-xl shadow-2xl z-[9999] min-w-[280px] max-h-[400px] overflow-y-auto">
                  <div className="py-3">
                    <div className="px-4 py-2 text-xs font-bold text-primary uppercase tracking-wider border-b border-border">
                      {category.Name}
                    </div>
                    {category.subcategories.map((subcat) => (
                      <Link
                        key={subcat.Id}
                        href={`/categories/${encodeURIComponent(subcat.Id)}`}
                        className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/90 hover:text-primary-foreground transition-all hover:translate-x-1 hover:font-medium"
                      >
                        • {subcat.Name}
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
