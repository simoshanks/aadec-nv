import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { historyData } from "@/data/db"; // ✅ استيراد البيانات

const HistorySection = () => {
  const milestones = historyData; // 🔄 بدل الداتا المحلية

  const [currentIndices, setCurrentIndices] = useState(
    Array(milestones.length).fill(0)
  );
  const [expanded, setExpanded] = useState(
    Array(milestones.length).fill(false)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndices((prev) =>
        prev.map((currIndex, i) => (currIndex + 1) % milestones[i].images.length)
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (index) => {
    setExpanded((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  return (
    <section className="relative bg-[#F5FCF8] py-20 overflow-hidden">
        <div className="text-center mb-12 lg:mb-14">
         <h2 className="text-4xl md:text-5xl font-extrabold text-[#146C2D] uppercase tracking-wider relative">
          NOTRE HISTOIRE 
        </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#146C2D] to-[#22A55D] mx-auto mt-6 rounded-full"></div>
          </div>

      <div className="space-y-32">
        {milestones.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -150 : 150 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`flex flex-col lg:flex-row items-center gap-10 ${
              index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            }`}
          >
            {/* Image Section */}
            <div className="w-full lg:w-1/2 relative h-80">
              <div
                className={`w-full h-full relative overflow-hidden 
                ${index % 2 === 0 ? "rounded-r-full" : "rounded-l-full"} 
                shadow-2xl drop-shadow-[0_35px_60px_rgba(0,0,0,0.5)]`}
              >
                {item.images.map((img, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={img}
                    alt={`${item.title} - ${imgIndex}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                      currentIndices[index] === imgIndex
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Text Section */}
            <div className="lg:w-1/2 px-6 text-gray-800">
              <p className="text-sm uppercase tracking-wider text-green-600 mb-2 border-l-4 border-green-600 pl-3">
                {item.year}
              </p>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {expanded[index]
                  ? item.desc
                  : item.desc.slice(0, 120) +
                    (item.desc.length > 120 ? "..." : "")}
              </p>

              <button
                onClick={() => toggleExpand(index)}
                className="inline-flex items-center gap-2 text-green-600 hover:underline font-semibold"
              >
                {expanded[index] ? "Lire moins" : "Lire plus"}{" "}
                <span className="text-lg">→</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HistorySection;
