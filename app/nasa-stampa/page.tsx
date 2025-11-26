"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Gallery from "@/components/Gallery";

export default function NasaStampa() {
  // List of existing images
  const existingImageNumbers = [
    1, 2, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45,
    46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 63, 64, 65,
    66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85,
    86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101,
  ];

  const galleryImages = existingImageNumbers.map((num) => {
    let extension = "jpg";
    if ((num >= 37 && num <= 70) || num === 72) {
      extension = "JPG";
    }
    return `/images/ad (${num}).${extension}`;
  });

  const stampeTekst = [
    {
      id: "sito-stampa",
      title: "Sito štampa",
      description:
        "Profesionalna sito štampa za tekstil i različite materijale",
      details: [
        "Visokokvalitetna štampa na tekstilnim materijalima",
        "Otporna na pranje i habanje",
        "Živopisne boje koje ne blede",
        "Idealna za majice, dukseve, torbe",
        "Mogućnost štampe na svetlim i tamnim podlogama",
        "Velika i mala narudžbina",
      ],
    },
    {
      id: "dtf-stampa",
      title: "DTF štampa",
      description: "Direct to Film - moderna tehnologija prenosa štampe",
      details: [
        "Štampa visokog kvaliteta sa detaljima",
        "Pogodna za sve vrste tekstila",
        "Brza izrada bez potrebe za film separacijom",
        "Izdržljiva i elastična",
        "Idealna za foto-realistične dizajne",
        "Ekonomična za male i srednje serije",
      ],
    },
    {
      id: "uv-stampa",
      title: "UV štampa",
      description: "Direktna UV štampa na različite materijale",
      details: [
        "Štampa na PVC, akriliku, metalu, staklu",
        "Visoka rezolucija i živopisne boje",
        "Otporna na UV zračenje i vlagu",
        "Bez potrebe za završnom obradom",
        "Brzo sušenje - instant rezultati",
        "Idealna za reklamne table, natpise",
      ],
    },
    {
      id: "laser",
      title: "Laser graviranje",
      description: "Precizna laser gravura na različitim materijalima",
      details: [
        "Graviranje na metalu, drvetu, koži, plastici",
        "Izuzetna preciznost i detalji",
        "Trajna i otporna gravura",
        "Personalizacija proizvoda",
        "Bez potrebe za bojama ili hemikalijama",
        "Idealno za poslovne poklone i suvenire",
      ],
    },
    {
      id: "suvi-zig",
      title: "Suvi žig",
      description: "Tradicionalni suvi žig za elegantne završnice",
      details: [
        "Elegantna reljefna tekstura",
        "Idealno za pozivnice, diplome, sertifikate",
        "Luksuzni profesionalni izgled",
        "Bez upotrebe boja - reljefni efekat",
        "Trajno i kvalitetno",
        "Savršeno za posebne prilike",
      ],
    },
    {
      id: "zlatotisak",
      title: "Zlatotisak",
      description: "Luksuzna zlatna i srebrna štampa",
      details: [
        "Elegantna zlatna i srebrna štampa",
        "Idealna za vizit karte, pozivnice",
        "Luksuzni i profesionalni izgled",
        "Štampa na papiru i kartonu",
        "Različiti tonovi zlatne i srebrne boje",
        "Premium kvalitet izrade",
      ],
    },
    {
      id: "tampon-stampa",
      title: "Tampon štampa",
      description: "Precizna štampa na irregularnim površinama",
      details: [
        "Štampa na hemijskim olovkama, upaljačima, USB-ovima",
        "Precizna reprodukcija logotipa",
        "Štampa do 4 boje",
        "Otporna na habanje",
        "Idealna za promotivne artikle",
        "Ekonomična za veće količine",
      ],
    },
    {
      id: "masinski-vez",
      title: "Mašinski vez",
      description: "Profesionalni vez za dugotrajan i premium izgled",
      details: [
        "Profesionalni mašinski vez logotipa",
        "Vez imena i tekstova",
        "Različite boje niti",
        "Vez na odeći, kapama, torbama",
        "Dugotrajna i kvalitetna izrada",
        "Izuzetna preciznost i 3D efekat",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero sekcija */}
      <section className="relative flex min-h-[100vh] md:min-h-[100vh] items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-[1]" />
        <Image
          src="/images/ad (31).jpg"
          alt="S.Z.T.R. AD-MARKETING - Naša štampa"
          fill
          className="object-cover"
          priority
        />
        <div className="relative container mx-auto px-4 md:px-8 z-[2]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto text-white"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Naša štampa</h1>
            <p className="text-xl md:text-2xl">
              Profesionalne tehnike štampe za sve vaše potrebe brendiranja i
              promocije
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vrste štampe u karticama */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <p className="text-lg md:text-xl text-muted max-w-4xl mx-auto">
              Sa 17 godina iskustva, nudimo različite tehnike štampe koje će
              vašim proizvodima dati profesionalan izgled i pomoći vam da se
              istaknete.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stampeTekst.map((stampa, index) => (
              <motion.div
                key={stampa.id}
                id={stampa.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-muted p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-primary mb-3">
                  {stampa.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {stampa.description}
                </p>
                <ul className="space-y-2">
                  {stampa.details.slice(0, 4).map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proces rada */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl text-white font-bold mb-4">
              Kako funkcioniše proces?
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Jednostavan proces od ideje do finalnog proizvoda
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Konsultacija",
                description: "Kontaktirajte nas i opišite šta vam je potrebno",
              },
              {
                step: "02",
                title: "Ponuda",
                description:
                  "Dobijate detaljnu ponudu i savet za najbolje rešenje",
              },
              {
                step: "03",
                title: "Izrada",
                description: "Naš tim profesionalno realizuje vaš projekat",
              },
              {
                step: "04",
                title: "Isporuka",
                description: "Preuzimate gotove proizvode vrhunskog kvaliteta",
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
                <div className="text-4xl md:text-5xl font-bold mb-3 opacity-70">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-base">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Galerija */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Galerija naših radova
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Pogledajte primere našeg rada i proizvoda koje nudimo
            </p>
          </motion.div>

          <Gallery images={galleryImages} />
        </div>
      </section>

      {/* CTA sekcija */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
              Spremni da započnete projekat?
            </h2>
            <p className="text-lg md:text-xl text-muted mb-8">
              Kontaktirajte nas danas i dobijte besplatnu konsultaciju i ponudu
              za vaš projekat. Naš tim je spreman da vam pomogne!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kontakt">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg"
                >
                  Pošaljite upit
                </motion.button>
              </Link>
              <a href="tel:+381691015511">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent text-primary border-primary border-2 px-8 py-4 rounded-lg font-semibold text-lg"
                >
                  Pozovite: 069/101 55 11
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
