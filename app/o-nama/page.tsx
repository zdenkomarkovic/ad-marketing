"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function ONama() {
  return (
    <div className="min-h-screen">
      {/* Hero sekcija */}
      <section className="relative flex min-h-[100vh] md:min-h-[100vh] items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-[1]" />
        <Image
          src="/images/ad (85).jpg"
          alt="S.Z.T.R. AD-MARKETING - O nama"
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">O nama</h1>
            <p className="text-xl md:text-2xl">
              S.Z.T.R. AD-MARKETING - Vaš pouzdan partner za reklamni materijal
              i usluge štampe
            </p>
          </motion.div>
        </div>
      </section>

      {/* Istorija firme */}
      <section className="pt-10 md:pt-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6">
              17 godina iskustva
            </h2>
            <p className="text-lg text-muted">
              S.Z.T.R. AD-MARKETING je vodeća kompanija u oblasti veleprodaje i
              maloprodaje reklamnog materijala sa sedištem u Čačku. Tokom 17
              godina rada, izgradili smo reputaciju pouzdanog partnera koji
              pruža kvalitetne proizvode i usluge.
            </p>
            <p className="text-lg text-muted">
              Naša strast prema kvalitetu i zadovoljstvu klijenata čini nas
              prvim izborom za sve vaše potrebe vezane za reklamni materijal i
              štampanje. Kroz godine, konstantno smo unapređivali naše usluge i
              širili asortiman proizvoda.
            </p>
            <p className="text-lg text-muted">
              Danas smo ponosni što možemo da ponudimo širok spektar usluga
              štampe, uključujući sito štampu, vez, tampon štampu i zlatotisak,
              kao i bogat asortiman reklamnog materijala.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Šta nudimo */}
      <section className="py-10 md:py-16 bg-background ">
        <div className="container mx-auto px-4 md:px-8  border-t-2 border-gray-500">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4 mt-8">
              Šta nudimo
            </h2>
            <p className="text-lg md:text-xl text-muted max-w-7xl mx-auto">
              Bavimo se proizvodnjom sitnog i krupnog reklamnog materijala.
              Pravimo kalendare, olovke, kape, priveske, otvarače i još mnogo
              toga drugog, a sve je odličnog kvaliteta, originalnog dizajna i na
              svemu može biti ime Vaše firme.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-muted p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold text-primary mb-6">
                Reklamni materijal
              </h3>
              <ul className="space-y-4">
                {[
                  "Kalendari - svih vrsta i formata",
                  "Olovke, hemijske, roler olovke",
                  "Kape sa logom vaše firme",
                  "Priveske i otvarači",
                  "Širok asortiman promotivnih artikala",
                  "Originalan dizajn i odličan kvalitet",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground text-lg">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-muted p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold text-primary mb-6">
                Usluge štampe
              </h3>
              <ul className="space-y-4">
                {[
                  "Sito štampa na tekstilu",
                  "DTF štampa - moderna tehnologija",
                  "UV štampa na različitim materijalima",
                  "Laser graviranje",
                  "Mašinski vez",
                  "Personalizacija po želji",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground text-lg">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-muted p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold text-primary mb-6">
                Proizvodnja uniformi
              </h3>
              <ul className="space-y-4">
                {[
                  "Radne pantalone",
                  "Kombinezoni za različite industrije",
                  "Radne košulje",
                  "Proizvodnja po porudžbini",
                  "Kvalitetna i pouzdana izrada",
                  "Poštovanje dogovorenih rokova",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground text-lg">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Distribucija i kvalitet */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background/95 to-background/90">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <h3 className="text-3xl font-bold text-muted mb-6">
                Naša distribucija
              </h3>
              <p className="text-lg text-muted mb-6">
                Svoje proizvode distribuiramo na teritoriji:
              </p>
              <ul className="space-y-3">
                {["Cele Srbije", "Nemačke", "Švajcarske"].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <h3 className="text-3xl font-bold text-muted mb-6">
                Naša garancija
              </h3>
              <p className="text-lg text-muted mb-6">
                Svoje usluge vršimo veoma kvalitetno i pouzdano, uz poštovanje
                svih unapred dogovorenih vremenskih rokova.
              </p>
              <ul className="space-y-3">
                {[
                  "Visok kvalitet izrade",
                  "Pouzdanost i profesionalizam",
                  "Poštovanje dogovorenih rokova",
                  "Fleksibilnost prema potrebama klijenata",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-lg">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lokacije */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Naše lokacije
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Posetite nas na našim lokacijama u Čačku
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-muted p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold text-primary mb-4">
                Sedište firme
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Adresa:</strong> MILUNA GAVRICA BR.45
                </p>
                <p>
                  <strong>Radno vreme:</strong>
                </p>
                <p>Ponedeljak - Petak: 08:00 - 15:00</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-muted p-8 rounded-lg"
            >
              <h3 className="text-2xl font-bold text-primary mb-4">
                Maloprodaja
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>Adresa:</strong> UL.DR.DRAGISE MISOVICA 177
                </p>
                <p>
                  <strong>Radno vreme:</strong>
                </p>
                <p>Ponedeljak - Petak: 09:00 - 20:00</p>
                <p>Subota: 09:00 - 15:00</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
