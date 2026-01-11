import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { galleryData } from "@/data/db"; // ✅ تأكد من المسار

export default function CoverflowSwiper() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="bg-[#F9F6F0] py-10">
      <div className="w-full max-w-5xl mx-auto">
        {/* 🟢 Title Section */}
        <div className="text-center mb-12 lg:mb-14">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-[#146C2D] rounded-full mb-4 sm:mb-6 shadow-md shadow-emerald-100">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white rounded-full mr-2 sm:mr-3 animate-pulse"></span>
              <span className="text-white font-medium text-xs sm:text-sm uppercase tracking-wider">
                GALERIE
              </span>
            </div>
            <div className="w-20 sm:w-24 lg:w-32 h-1 bg-[#146C2D] mx-auto mb-6 sm:mb-8 rounded-full shadow-sm"></div>

            <p className="text-base lg:text-lg text-gray-700 max-w-2xl mx-auto mt-6 leading-relaxed font-medium">
              Quelques moments du parcours de l'AADEC.
            </p>

            <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto mt-3 italic leading-relaxed">
              Archive photos et textes de commentaire — <span className="font-semibold text-gray-800">MR: Lamsallak Saïd</span>,
              membre fondateur en <span className="text-[#146C2D] font-semibold">2000</span> et
              secrétaire général chargé des affaires administratives de
              <span className="text-[#22A55D] font-semibold"> 2010 à 2025</span>.
            </p>
          </div>

        </div>

        {/* 🎞️ Swiper */}
        <Swiper
          modules={[EffectCoverflow, Autoplay]}
          effect="coverflow"
          centeredSlides={true}
          slidesPerView={"auto"}
          loop={true}
          speed={2500}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 200,
            modifier: 2.5,
            slideShadows: true,
          }}
          allowTouchMove={false}
          className="rounded-xl"
        >
          {galleryData.map((item) => (
            <SwiperSlide
              key={item.id}
              className="w-64 h-80 flex justify-center items-center"
            >
              {/* 🖼️ Image container with overlay */}
              <div
                className="relative w-48 h-60 rounded-xl overflow-hidden border-4 border-white shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
                style={{ boxShadow: "0 10px 25px #D59B49" }}
                onClick={() => setSelectedImage(item)}
              >
                {/* ✅ Image */}
                <img
                  src={item.image}
                  alt={item.description}
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />

                {/* 🟡 Overlay with description */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white text-sm text-center px-3 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 🪟 Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl w-[90%]">
            {/* ❌ Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-white/80 hover:bg-white text-black rounded-full p-2 transition"
            >
              ✕
            </button>

            {/* 🖼️ Image */}
            <img
              src={selectedImage.image}
              alt={selectedImage.description}
              className="w-full rounded-xl shadow-2xl object-contain max-h-[80vh] mx-auto"
            />

            {/* 📝 Description */}
            <p className="text-center text-white mt-4 text-sm md:text-base">
              {selectedImage.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
