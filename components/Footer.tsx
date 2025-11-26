"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      className="bg-muted py-12 md:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8">
          {/* O firmi */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">
              S.Z.T.R. AD-MARKETING
            </h3>
            <p className="text-muted-foreground mb-4">
              Veleprodaja i maloprodaja reklamnog materijala sa 17 godina iskustva u industriji.
            </p>
            <p className="text-sm text-muted-foreground">
              Vaš partner za sve vrste reklamnog i promotivnog materijala.
            </p>
          </div>

          {/* Brzi linkovi */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Brzi linkovi</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Početna
                </Link>
              </li>
              <li>
                <Link
                  href="/o-nama"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  O nama
                </Link>
              </li>
              <li>
                <Link
                  href="/proizvodi"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Proizvodi
                </Link>
              </li>
              <li>
                <Link
                  href="/nasa-stampa"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Naša štampa
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <PhoneIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+381691015511"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  069/101 55 11
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MailIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:prodaja@adm.rs"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  prodaja@adm.rs
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-muted-foreground">
                  <p className="font-semibold">Sedište:</p>
                  <p className="text-sm">Miluna Gavrica br.45, Čačak</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPinIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-muted-foreground">
                  <p className="font-semibold">Maloprodaja:</p>
                  <p className="text-sm">Ul.Dr.Dragiše Mišovića 177, Čačak</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Radno vreme */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">Radno vreme</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-muted-foreground flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-primary" />
                  Sedište
                </p>
                <p className="text-sm text-muted-foreground">Pon - Pet: 08:00 - 15:00</p>
                <p className="text-sm text-muted-foreground">Sub - Ned: Zatvoreno</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-primary" />
                  Maloprodaja
                </p>
                <p className="text-sm text-muted-foreground">Pon - Pet: 09:00 - 20:00</p>
                <p className="text-sm text-muted-foreground">Subota: 09:00 - 15:00</p>
                <p className="text-sm text-muted-foreground">Nedelja: Zatvoreno</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} S.Z.T.R. AD-MARKETING. Sva prava zadržana.
            </p>
            <a
              href="https://www.manikamwebsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Izrada sajta:{" "}
              <span className="font-bold text-primary">ManikamWebSolutions</span>
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
