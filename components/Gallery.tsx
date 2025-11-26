"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryProps {
  images: string[];
  imagesPerPage?: number;
}

export default function Gallery({ images, imagesPerPage = 12 }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Calculate pagination
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = images.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to gallery section instead of page top
      if (galleryRef.current) {
        const offset = 100; // Offset for header
        const elementPosition = galleryRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setDirection(-1);
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setDirection(1);
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;

    if (info.offset.x > swipeThreshold) {
      goToPrevious();
    } else if (info.offset.x < -swipeThreshold) {
      goToNext();
    }
  };

  useEffect(() => {
    if (selectedImage === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      } else if (e.key === "ArrowLeft") {
        setDirection(-1);
        setSelectedImage(prev => prev === null || prev === 0 ? images.length - 1 : prev - 1);
      } else if (e.key === "ArrowRight") {
        setDirection(1);
        setSelectedImage(prev => prev === null || prev === images.length - 1 ? 0 : prev + 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage, images.length]);

  return (
    <>
      {/* Gallery Grid */}
      <div ref={galleryRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {currentImages.map((image, index) => (
          <motion.div
            key={startIndex + index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.02 }}
            whileHover={{ scale: 1.05 }}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted"
            onClick={() => openLightbox(startIndex + index)}
          >
            <Image
              src={image}
              alt={`Galerija slika ${startIndex + index + 1}`}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </motion.div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentPage === 1
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);

                const showEllipsis =
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2);

                if (showEllipsis) {
                  return (
                    <span key={page} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  );
                }

                if (!showPage) return null;

                return (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-primary/20"
                    }`}
                  >
                    {page}
                  </motion.button>
                );
              })}
            </div>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                currentPage === totalPages
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Page Info */}
          <p className="text-muted-foreground text-sm">
            Stranica {currentPage} od {totalPages} ({images.length} slika ukupno)
          </p>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence mode="wait" custom={direction}>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-[110] text-white bg-black/50 hover:bg-primary rounded-full p-3 transition-colors"
              aria-label="Zatvori"
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </motion.button>

            {/* Previous Button */}
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 md:left-4 z-[110] text-white bg-black/50 hover:bg-primary rounded-full p-3 md:p-4 transition-colors"
              aria-label="Prethodna slika"
            >
              <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
            </motion.button>

            {/* Next Button */}
            <motion.button
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 md:right-4 z-[110] text-white bg-black/50 hover:bg-primary rounded-full p-3 md:p-4 transition-colors"
              aria-label="Sledeća slika"
            >
              <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
            </motion.button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[110] text-white bg-black/50 px-4 py-2 rounded-full text-base md:text-lg font-semibold">
              {selectedImage + 1} / {images.length}
            </div>

            {/* Image with Swipe */}
            <motion.div
              key={selectedImage}
              custom={direction}
              initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -1000 : 1000, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="relative w-full h-full cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedImage]}
                alt={`Galerija slika ${selectedImage + 1}`}
                fill
                className="object-contain select-none pointer-events-none"
                sizes="100vw"
                priority
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
