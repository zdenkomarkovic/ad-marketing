"use client";

import Image from "next/image";
import Logo from "../public/android-chrome-192x192.png";
import Link from "next/link";
import { MenuIcon, PhoneIcon, ChevronDown } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navList } from "@/constants/index";
import CategoriesDropdown from "./CategoriesDropdown";

interface Category {
  Id: string;
  Name: string;
  Parent: string;
}

interface HeaderProps {
  categories: Category[];
}

const mobTitleStyles = "text-lg py-2  text-muted";

const MobileMenu = ({ categories }: { categories: Category[] }) => {
  const [expandedCategory, setExpandedCategory] = useState(false);

  // Show ALL parent categories
  const parentCategories = categories.filter((c) => c.Parent === "*");

  return (
    <Sheet>
      <SheetTrigger className="lg:hidden  text-muted">
        <MenuIcon className=" text-muted cursor-pointer" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetContent>
            <ul>
              {navList.map((item, index) => {
                if (item.hasDropdown) {
                  return (
                    <div key={index}>
                      <motion.li
                        whileHover={{ color: "hsl(var(--primary))" }}
                        className={mobTitleStyles}
                        onClick={() => setExpandedCategory(!expandedCategory)}
                      >
                        <div className="flex items-center justify-between cursor-pointer">
                          <span>{item.title}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              expandedCategory ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </motion.li>
                      {expandedCategory && (
                        <div className="pl-4 space-y-2 mt-2">
                          {parentCategories.map((cat) => (
                            <Link key={cat.Id} href={`/categories/${encodeURIComponent(cat.Id)}`}>
                              <SheetTrigger className="block w-full text-left text-sm py-1 text-muted-foreground hover:text-primary">
                                {cat.Name}
                              </SheetTrigger>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link key={index} href={item.link}>
                    <motion.li
                      whileHover={{ color: "hsl(var(--primary))" }}
                      className={mobTitleStyles}
                    >
                      <SheetTrigger>{item.title}</SheetTrigger>
                    </motion.li>
                  </Link>
                );
              })}
            </ul>
          </SheetContent>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const DesktopNav = ({ categories }: { categories: Category[] }) => (
  <ul className="hidden gap-8 lg:flex  text-xl">
    {navList.map((item, index) => {
      if (item.hasDropdown) {
        return (
          <li key={index} className="relative group">
            <Link href={item.link}>
              <motion.div
                className="transition-colors underline-animation cursor-pointer flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
              >
                {item.title}
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </motion.div>
            </Link>
            <CategoriesDropdown categories={categories} />
          </li>
        );
      }
      return (
        <Link key={index} href={item.link}>
          <motion.li
            className="transition-colors underline-animation"
            whileHover={{ scale: 1.1 }}
          >
            {item.title}
          </motion.li>
        </Link>
      );
    })}
  </ul>
);

export default function Header({ categories }: HeaderProps) {
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
    <header
      className={`flex justify-center ${
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md"
          : "bg-transparent "
      }  fixed top-0 left-0 right-0 z-[50] transition-colors`}
    >
      <nav className="flex items-center text-white justify-between px-8 py-4 max-w-[80rem] w-full font-bold">
        <Link href="/" className="">
          <Image
            src={Logo}
            alt="dm rustic 24"
            width={50}
            height={50}
            className=""
          />
        </Link>
        <DesktopNav categories={categories} />
        <Link href="tel:+381691015511">
          <motion.button
            whileHover={{
              color: "hsl(var(--foreground))",
              backgroundColor: "hsl(var(--primary))",
            }}
            className=" items-center justify-center rounded-full   border-2 text-sm md:text-lg py-1 px-2 md:py-2 md:px-4 transition-colors flex"
          >
            <PhoneIcon />
            <p className="">069/101 55 11</p>
          </motion.button>
        </Link>
        <MobileMenu categories={categories} />
      </nav>
    </header>
  );
}
