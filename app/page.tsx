import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
          Dobrodošli
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Otkrijte naš asortiman proizvoda
        </p>
        <Link
          href="/proizvodi"
          className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Pogledajte Proizvode
        </Link>
      </div>
    </div>
  );
}
