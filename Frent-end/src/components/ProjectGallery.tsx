import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Pagination, Autoplay } from "swiper/modules";
import { X } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";

interface GalleryImage {
  id: number;
  image: string;
}

interface Props {
  images: GalleryImage[];
  apiUrl: string;
  projectTitle: string;
}

const ProjectGallery = ({ images, apiUrl, projectTitle }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const SwiperContent = (fullscreen = false) => (
    <Swiper
      modules={[EffectCube, Pagination, Autoplay]}
      effect="cube"
      grabCursor
      loop
      speed={fullscreen ? 1200 : 2500}
      autoplay={
        fullscreen
          ? false
          : { delay: 2000, disableOnInteraction: false }
      }
      cubeEffect={{
        shadow: true,
        slideShadows: true,
        shadowOffset: 40,
        shadowScale: 1,
      }}
      pagination={{ clickable: true }}
      initialSlide={startIndex}
      className={`rounded-2xl ${fullscreen ? "" : "shadow-2xl"}`}
    >
      {images.map((img, index) => (
        <SwiperSlide key={img.id}>
          <img
            src={`${apiUrl}/uploads/gallery/${img.image}`}
            alt={`${projectTitle} - ${index + 1}`}
            className={`w-full ${
              fullscreen ? "h-[90vh] object-contain" : "h-[380px] object-cover"
            } rounded-2xl cursor-pointer`}
            loading="lazy"
            onClick={() => {
              if (!fullscreen) {
                setStartIndex(index);
                setIsOpen(true);
              }
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return (
    <>
      {/* NORMAL GALLERY */}
      <section className="w-full py-12 bg-[#F9F6F0] rounded-3xl">
        <div className="max-w-xl mx-auto">
          {SwiperContent(false)}
        </div>
      </section>

      {/* FULLSCREEN MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-6">
          {/* CLOSE */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-red-400 transition"
          >
            <X className="w-9 h-9" />
          </button>

          <div className="w-full max-w-5xl">
            {SwiperContent(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectGallery;
