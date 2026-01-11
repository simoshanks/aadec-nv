import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

const GallerySection = ({ gallery, title }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section id="galerie" className="relative py-4 lg:py-12 px-6 sm:px-6 lg:px-6 bg-[#F5FCF8] overflow-hidden">

      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#146C2D]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#22A55D]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">


        {/* Swiper Container */}
<Swiper
  modules={[Autoplay, Pagination, Navigation, EffectCoverflow, ]}
  effect="coverflow"
  grabCursor={true}
  centeredSlides={true}
  slidesPerView={1.3}
  loop={true}
  spaceBetween={40}
  speed={800}
  coverflowEffect={{
    rotate: 5,
    stretch: -20,
    depth: 120,
    modifier: 1.8,
    slideShadows: true,
    scale: 0.85
  }}
  autoplay={{ 
    delay: 5000, 
    disableOnInteraction: false, 
    pauseOnMouseEnter: true 
  }}
  pagination={{ 
    clickable: true,
    dynamicBullets: true,
    renderBullet: (index, className) => {
      return `<span class="${className} !w-2 !h-2 !bg-white/50 !mx-1 hover:!bg-white !transition-all !duration-300"></span>`;
    }
  }}
  navigation={{
    nextEl: '.swiper-button-next-visible',
    prevEl: '.swiper-button-prev-visible',
  }}
  className="!pb-20"
>
  {/* Navigation toujours visible */}
  <div className="swiper-button-prev-visible absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-3xl">
    <svg className="w-7 h-7 text-[#146C2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </div>
  
  <div className="swiper-button-next-visible absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-3xl">
    <svg className="w-7 h-7 text-[#146C2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </div>

  {gallery.map((img, index) => (
    <SwiperSlide key={index}>
      <div
        className="group relative rounded-3xl overflow-hidden bg-white shadow-xl hover:shadow-3xl transition-all duration-500 ease-out transform hover:-translate-y-2 cursor-pointer border border-gray-100"
        onClick={() => setSelectedImage(img)}
      >
        <div className="relative h-80 lg:h-96 overflow-hidden">
          <img
            src={img}
            alt={`${title} - Image ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-900 font-bold text-sm shadow-lg border border-white/30">
            {index + 1}
          </div>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>

 
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
              loading="lazy"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
