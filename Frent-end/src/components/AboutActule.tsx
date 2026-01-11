import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCube, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import { Play } from "lucide-react";

const AboutActule = ({ projet }) => {
  if (!projet) return null;

  // 🔹 الشرط: فقط لمشروع Azicode
  const isAzicode = projet.titre.toLowerCase().includes("azicode");

  return (
    <section className="w-full py-20 bg-[#F5FCF8]">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        {/* Swiper Section */}
        <div className="md:w-3/5 w-full max-w-lg mx-auto">
          <Swiper
            modules={[EffectCube, Pagination, Autoplay]}
            effect="cube"
            grabCursor={true}
            autoplay={{ delay: 1500, disableOnInteraction: false }}
            speed={2500}
            cubeEffect={{
              shadow: true,
              slideShadows: true,
              shadowOffset: 40,
              shadowScale: 1,
            }}
            loop={true}
            pagination={{ clickable: true }}
            className="rounded-xl"
          >
            {projet.gallery.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Text + Buttons */}
        <div className="md:w-2/5 w-full text-[#000] flex flex-col justify-between">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              {projet.titre}
            </h2>
            <p className="text-lg leading-relaxed">{projet.descriptionLongue}</p>
          </div>

          {/* Video Buttons فقط إذا المشروع هو Azicode */}
{isAzicode && (
  <div className="mt-8">
    <h3 className="text-xl font-semibold text-[#146C2D] mb-4">
      Mieux connaître l'école Azicode62 :
    </h3>

    <div className="flex justify-start gap-4">
      <a
        href={projet.video1 || "https://drive.google.com/file/d/1epyfZ1sI6fwt-NLsGXtWY7XlLrnO-e3i/view?usp=sharing"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#146C2D] text-white px-5 py-2 rounded-full shadow-md hover:bg-[#D59B49] transition-all duration-300"
      >
        <Play size={18} />
        Vidéo 1
      </a>

      <a
        href={projet.video2 || "https://drive.google.com/file/d/1HP-pvsOZG2t523QemfSolUspsLXxBs5E/view?usp=sharing"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#146C2D] text-white px-5 py-2 rounded-full shadow-md hover:bg-[#D59B49] transition-all duration-300"
      >
        <Play size={18} />
        Vidéo 2
      </a>
    </div>
  </div>
)}


        </div>
      </div>
    </section>
  );
};

export default AboutActule;
