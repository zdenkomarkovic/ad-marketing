"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircle2,
  Users,
  Award,
  Target,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[100dvh] items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-[1]" />
        <Image
          src="/hero.jpg"
          alt="S.Z.T.R. AD-MARKETING - Reklamni materijal"
          fill
          className="object-cover"
          priority
        />

        <div className="relative container px-4 md:px-8 mx-auto flex flex-col gap-6 items-center justify-center z-[2] text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-4xl md:text-7xl font-bold"
          >
            S.Z.T.R. AD-MARKETING
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-xl md:text-4xl font-medium max-w-3xl"
          >
            Veleprodaja i maloprodaja reklamnog materijala
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-white text-lg md:text-2xl"
          >
            17 godina iskustva u štampanju i prodaji reklamnog materijala
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row gap-4 mt-6"
          >
            <Link href="/proizvodi">
              <motion.button
                whileHover={{ translateY: "-5px" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-lg"
              >
                Pogledajte proizvode
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/kontakt">
              <motion.button
                whileHover={{ translateY: "-5px" }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent text-white border-white border-2 rounded-lg px-6 py-3 md:px-8 md:py-4 font-semibold text-lg"
              >
                Kontaktirajte nas
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* O firmi sekcija */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background to-background/80 text-muted">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              O nama
            </h2>
            <p className="text-lg md:text-xl text-muted max-w-7xl mx-auto">
              Sa 17 godina iskustva, specijalizovani smo za veleprodaju
              reklamnog materijala i pružamo vrhunske usluge štampe za sve vaše
              potrebe brendiranja i promocije.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="/images/ad (84).jpg"
                  alt="S.Z.T.R. AD-MARKETING - O nama"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold mb-3 text-muted">
                  Naša misija
                </h3>
                <p className="text-muted">
                  Pružamo kvalitetne reklamne proizvode i usluge štampe koje
                  pomažu vašem brendu da se istakne. Naš cilj je da vam
                  omogućimo najbolje rešenje za sve vaše promotivne potrebe.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-muted mb-3">
                  Naše vrednosti
                </h3>
                <p className="text-muted">
                  Kvalitet, pouzdanost i zadovoljstvo kupaca su temelji našeg
                  poslovanja. Svaki projekat pristupamo sa maksimalnom pažnjom i
                  profesionalnošću.
                </p>
              </div>
              <Link href="/o-nama">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-6 py-3 mt-5 rounded-lg font-semibold"
                >
                  Saznajte više
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vrste štampe */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background to-background/80">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Naša štampa
            </h2>
            <p className="text-lg md:text-xl text-muted">
              Nudimo različite tehnike štampe za sve vaše potrebe
            </p>
          </motion.div>

          <div className="grid  md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Sito štampa",
                description:
                  "Visokokvalitetna štampa za tekstil i različite materijale",
                link: "/nasa-stampa#sito-stampa",
              },
              {
                title: "DTF štampa",
                description:
                  "Moderna Direct to Film tehnologija prenosa štampe",
                link: "/nasa-stampa#dtf-stampa",
              },
              {
                title: "UV štampa",
                description: "Direktna UV štampa na različite materijale",
                link: "/nasa-stampa#uv-stampa",
              },
              {
                title: "Laser graviranje",
                description: "Precizna laser gravura na materijalima",
                link: "/nasa-stampa#laser",
              },
              {
                title: "Suvi žig",
                description: "Elegantna reljefna tekstura za posebne prilike",
                link: "/nasa-stampa#suvi-zig",
              },
              {
                title: "Zlatotisak",
                description: "Luksuzna zlatna i srebrna štampa",
                link: "/nasa-stampa#zlatotisak",
              },
              {
                title: "Tampon štampa",
                description: "Precizna štampa na irregularnim površinama",
                link: "/nasa-stampa#tampon-stampa",
              },
              {
                title: "Mašinski vez",
                description: "Profesionalni vez za premium izgled",
                link: "/nasa-stampa#masinski-vez",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-background to-background/50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-muted mb-4">{item.description}</p>
                <Link href={item.link}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Saznajte više
                    <ArrowRightIcon className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Zašto izabrati nas */}
      <section className="py-10 md:py-16 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl text-white font-bold mb-6">
              Zašto izabrati nas?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                number: "17+",
                title: "Godina iskustva",
                description: "U industriji reklamnog materijala",
              },
              {
                number: "1000+",
                title: "Zadovoljnih klijenata",
                description: "Koji nam kontinuirano veruju",
              },
              {
                number: "100%",
                title: "Posvećenost kvalitetu",
                description: "U svakom proizvodu i usluzi",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-bold mb-3">
                  {item.number}
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link href="/kontakt">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg"
              >
                Kontaktirajte nas danas
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Šta nudimo */}
      {/* Naše vrednosti */}
      <section className="py-10 md:py-16 bg-gradient-to-br from-background to-background/80">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Naše vrednosti
            </h2>
            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto">
              Vrednosti koje nas vode u svakom projektu i poslovnoj odluci
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Kvalitet",
                description:
                  "Najviši standardi kvaliteta u svakom proizvodu i usluzi koju pružamo",
              },
              {
                icon: Users,
                title: "Pouzdanost",
                description:
                  "17 godina iskustva i hiljade zadovoljnih klijenata su naš najbolji dokaz",
              },
              {
                icon: Target,
                title: "Profesionalizam",
                description:
                  "Svaki projekat realizujemo sa maksimalnom pažnjom i stručnošću",
              },
              {
                icon: CheckCircle2,
                title: "Zadovoljstvo",
                description:
                  "Vaše zadovoljstvo je naš prioritet i cilj svakog projekta",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background p-8 rounded-lg shadow-lg text-center"
                >
                  <Icon className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Kontakt info sekcija */}
      <section className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl text-white font-bold mb-4">
              Posetite nas
            </h2>
            <p className="text-lg md:text-xl">Radujemo se vašoj poseti!</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <MapPinIcon className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Sedište</h3>
              <p>MILUNA GAVRICA BR.45</p>
              <div className="mt-4">
                <h4 className="font-bold mb-1">Maloprodaja</h4>
                <p>UL.DR.DRAGISE MISOVICA 177</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <PhoneIcon className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Kontakt</h3>
              <p className="mb-2">
                <a href="tel:+381691015511" className="hover:underline">
                  069/101 55 11
                </a>
              </p>
              <p>
                <a href="mailto:prodaja@adm.rs" className="hover:underline">
                  prodaja@adm.rs
                </a>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <ClockIcon className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Radno vreme</h3>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold">Sedište</p>
                  <p className="text-sm">Ponedeljak-Petak: 08h-15h</p>
                </div>
                <div>
                  <p className="font-semibold">Maloprodaja</p>
                  <p className="text-sm">Ponedeljak-Petak: 09h-20h</p>
                  <p className="text-sm">Subota: 09h-15h</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link href="/kontakt">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg"
              >
                Pošaljite nam poruku
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
