"use client";

import { motion } from "framer-motion";
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function Kontakt() {
  return (
    <div className="min-h-screen">
      {/* Hero sekcija */}
      <section className="relative pt-32 pb-20 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Kontaktirajte nas
            </h1>
            <p className="text-xl md:text-2xl">
              Radujemo se vašem upitu! Naš tim je spreman da odgovori na sva
              vaša pitanja
            </p>
          </motion.div>
        </div>
      </section>

      {/* Kontakt informacije */}
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
              Kako nas možete kontaktirati?
            </h2>
            <p className="text-lg text-muted">
              Izaberite način komunikacije koji vam najviše odgovara
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-muted p-6 rounded-lg text-center"
            >
              <PhoneIcon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Telefon</h3>
              <a
                href="tel:+381691015511"
                className="text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                069/101 55 11
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-muted p-6 rounded-lg text-center"
            >
              <MailIcon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Email</h3>
              <a
                href="mailto:prodaja@adm.rs"
                className="text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                prodaja@adm.rs
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-muted p-6 rounded-lg text-center"
            >
              <MapPinIcon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">Sedište</h3>
              <p className="text-muted-foreground">
                MILUNA GAVRICA BR.45
                <br />
                Čačak
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-muted p-6 rounded-lg text-center"
            >
              <MapPinIcon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-3">
                Maloprodaja
              </h3>
              <p className="text-muted-foreground">
                UL.DR.DRAGISE MISOVICA 177
                <br />
                Čačak
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Kontakt forma i radno vreme */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Kontakt forma */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-primary mb-6">
                Pošaljite nam poruku
              </h2>
              <p className="text-muted-foreground mb-6">
                Popunite formu ispod i odgovorićemo vam u najkraćem mogućem
                roku.
              </p>
              <ContactForm />
            </motion.div>

            {/* Radno vreme */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-primary mb-6">
                  Radno vreme
                </h2>
                <p className="text-muted-foreground mb-6">
                  Posetite nas tokom radnog vremena ili nas kontaktirajte u bilo
                  koje vreme.
                </p>
              </div>

              <div className="bg-background p-8 rounded-lg">
                <div className="flex items-start gap-4 mb-6">
                  <ClockIcon className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      Sedište firme
                    </h3>
                    <div className="space-y-2 text-muted">
                      <p className="font-semibold">MILUNA GAVRICA BR.45</p>
                      <div className="border-t border-muted pt-3 mt-3">
                        <p className="font-medium mb-2">Radno vreme:</p>
                        <p>
                          Ponedeljak - Petak:{" "}
                          <span className="font-semibold">08:00 - 15:00</span>
                        </p>
                        <p className="text-sm mt-2 text-muted">
                          Subota i Nedelja: Zatvoreno
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background p-8 rounded-lg">
                <div className="flex items-start gap-4">
                  <ClockIcon className="w-8 h-8 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      Maloprodaja
                    </h3>
                    <div className="space-y-2 text-muted">
                      <p className="font-semibold">
                        UL.DR.DRAGISE MISOVICA 177
                      </p>
                      <div className="border-t border-muted pt-3 mt-3">
                        <p className="font-medium mb-2">Radno vreme:</p>
                        <p>
                          Ponedeljak - Petak:{" "}
                          <span className="font-semibold">09:00 - 20:00</span>
                        </p>
                        <p>
                          Subota:{" "}
                          <span className="font-semibold">09:00 - 15:00</span>
                        </p>
                        <p className="text-sm mt-2 text-muted">
                          Nedelja: Zatvoreno
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mapa sekcija - Placeholder */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Gde se nalazimo?
            </h2>
            <p className="text-lg text-muted">Naše lokacije u Čačku</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Sedište - Mapa */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-primary mb-4">
                Sedište firme
              </h3>
              <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2874.679603410021!2d20.37060087667348!3d43.90390213617952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47576d89a17f24b9%3A0x9ab605202210d73!2z0JzQuNC70YPQvdCwINCT0LDQstGA0LjRm9CwIDQ1LCDQp9Cw0YfQsNC6!5e0!3m2!1ssr!2srs!4v1764035934681!5m2!1ssr!2srs"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold text-primary">
                  MILUNA GAVRICA BR.45, Čačak
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ponedeljak - Petak: 08:00 - 15:00
                </p>
              </div>
            </motion.div>

            {/* Maloprodaja - Mapa */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h3 className="text-2xl font-bold text-primary mb-4">
                Maloprodaja
              </h3>
              <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg mb-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2875.412632298477!2d20.34948947667273!3d43.88871993716554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475772153479904d%3A0x7601c4d25208d2fe!2z0JTRgC4g0JTRgNCw0LPQuNGI0LUg0JzQuNGI0L7QstC40ZvQsCAxNzcsINCn0LDRh9Cw0Lo!5e0!3m2!1ssr!2srs!4v1764115094995!5m2!1ssr!2srs"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-semibold text-primary">
                  UL.DR.DRAGISE MISOVICA 177, Čačak
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ponedeljak - Petak: 09:00 - 20:00 | Subota: 09:00 - 15:00
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dodatne informacije */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl text-white font-bold mb-6">
              Imate pitanja?
            </h2>
            <p className="text-xl mb-8">
              Naš tim je uvek spreman da vam pomogne. Kontaktirajte nas putem
              telefona, emaila ili posetite nas lično u našim prodajnim
              objektima.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+381691015511">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2"
                >
                  <PhoneIcon className="w-5 h-5" />
                  Pozovite nas
                </motion.button>
              </a>
              <a href="mailto:prodaja@adm.rs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent text-white border-white border-2 px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2"
                >
                  <MailIcon className="w-5 h-5" />
                  Pošaljite email
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Firma info */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-primary mb-4">
              S.Z.T.R. AD-MARKETING
            </h3>
            <div className="text-muted-foreground space-y-2">
              <p>Veleprodaja i maloprodaja reklamnog materijala</p>
              <p>17 godina iskustva u industriji</p>
              <p className="text-sm mt-4">
                Email:{" "}
                <a
                  href="mailto:prodaja@adm.rs"
                  className="text-primary hover:underline"
                >
                  prodaja@adm.rs
                </a>
                {" | "}
                Tel:{" "}
                <a
                  href="tel:+381691015511"
                  className="text-primary hover:underline"
                >
                  069/101 55 11
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
