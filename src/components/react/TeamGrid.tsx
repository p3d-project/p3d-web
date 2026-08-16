import React, { useState } from "react";

// Import silhouette SVGs from assets
import aigis from "../../assets/aigis 2.svg?url";
import akihiko from "../../assets/akihikosanada 2.svg?url";
import fuuka from "../../assets/fuukayamagishi 2.svg?url";
import junpei from "../../assets/junpeiiori 2.svg?url";
import ken from "../../assets/kenamada 2.svg?url";
import koromaru from "../../assets/koromaru 2.svg?url";
import kotone from "../../assets/kotoneshiomi 3.svg?url";
import makoto from "../../assets/makotoyuki 3.svg?url";
import mitsuru from "../../assets/mitsurukirijo 2.svg?url";
import shinjiro from "../../assets/shinjiroaragaki 2.svg?url";
import yukari from "../../assets/yukaritakeba 2.svg?url";

export default function TeamGrid() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const handleTeamClick = (teamName: string) => {
    setSelectedTeam(teamName);
    const targetSection = document.getElementById("team");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      {/* MOBILE LAYOUT (< lg) */}
      <div className="flex flex-col gap-8 sm:gap-10 w-full py-4 px-1 lg:hidden">
        {/* Row 1: Game Dev | Web Dev | UX/UI */}
        <div className="grid grid-cols-3 gap-1 sm:gap-3 items-end justify-items-center w-full">
          {/* Game Dev */}
          <div 
            onClick={() => handleTeamClick("Game Dev")}
            className="flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-base sm:text-lg font-extrabold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              Game Dev
            </h3>
            <div className="flex items-end justify-center gap-1">
              <img src={makoto} alt="Makoto Yuki" className="h-[195px] sm:h-[240px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
              <img src={kotone} alt="Kotone Shiomi" className="h-[195px] sm:h-[240px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>

          {/* Web Dev */}
          <div 
            onClick={() => handleTeamClick("Web Dev")}
            className="flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-base sm:text-lg font-extrabold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              Web Dev
            </h3>
            <div className="flex items-end justify-center">
              <img src={aigis} alt="Aigis" className="h-[195px] sm:h-[240px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>

          {/* UX/UI */}
          <div 
            onClick={() => handleTeamClick("UX/UI")}
            className="flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-base sm:text-lg font-extrabold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              UX/UI
            </h3>
            <div className="flex items-end justify-center">
              <img src={yukari} alt="Yukari Takeba" className="h-[195px] sm:h-[240px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>
        </div>

        {/* Row 2: Graphics */}
        <div 
          onClick={() => handleTeamClick("Graphics")}
          className="flex flex-col items-center group cursor-pointer w-full select-none active:scale-95 transition-transform duration-200"
        >
          <h3
            style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
            className="text-base sm:text-lg font-extrabold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
          >
            Graphics
          </h3>
          <div className="flex items-end justify-center gap-2 sm:gap-3">
            <img src={akihiko} alt="Akihiko Sanada" className="h-[210px] sm:h-[255px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            <img src={mitsuru} alt="Mitsuru Kirijo" className="h-[210px] sm:h-[255px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            <img src={shinjiro} alt="Shinjiro Aragaki" className="h-[230px] sm:h-[275px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
          </div>
        </div>

        {/* Row 3: Music | 3D | Video */}
        <div className="grid grid-cols-3 gap-1 sm:gap-3 items-end justify-items-center w-full">
          {/* Music */}
          <div 
            onClick={() => handleTeamClick("Music")}
            className="flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-base sm:text-lg font-extrabold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              Music
            </h3>
            <div className="flex items-end justify-center">
              <img src={junpei} alt="Junpei Iori" className="h-[195px] sm:h-[240px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>

          {/* 3D */}
          <div 
            onClick={() => handleTeamClick("3D")}
            className="flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-base sm:text-lg font-extrabold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              3D
            </h3>
            <div className="flex items-end justify-center gap-1">
              <img src={ken} alt="Ken Amada" className="h-[195px] sm:h-[240px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
              <img src={koromaru} alt="Koromaru" className="h-[98px] sm:h-[120px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>

          {/* Video */}
          <div 
            onClick={() => handleTeamClick("Video")}
            className="flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-base sm:text-lg font-extrabold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              Video
            </h3>
            <div className="flex items-end justify-center">
              <img src={fuuka} alt="Fuuka Yamagishi" className="h-[180px] sm:h-[225px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT (>= lg) */}
      <div className="hidden lg:flex flex-col justify-center gap-12 lg:gap-16 py-4 pr-2 pl-0 w-full">
        {/* Top Row: Game Dev | Web Dev | UX/UI | 3D */}
        <div className="grid grid-cols-4 gap-4 lg:gap-8 items-end justify-items-center w-full">
          <div 
            onClick={() => handleTeamClick("Game Dev")}
            className="flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-xl lg:text-2xl font-bold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              Game Dev
            </h3>
            <div className="flex items-end justify-center gap-3">
              <img src={makoto} alt="Makoto Yuki" className="h-[180px] lg:h-[230px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
              <img src={kotone} alt="Kotone Shiomi" className="h-[180px] lg:h-[230px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>

          <div 
            onClick={() => handleTeamClick("Web Dev")}
            className="flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-xl lg:text-2xl font-bold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              Web Dev
            </h3>
            <div className="flex items-end justify-center">
              <img src={aigis} alt="Aigis" className="h-[180px] lg:h-[230px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>

          <div 
            onClick={() => handleTeamClick("UX/UI")}
            className="flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-xl lg:text-2xl font-bold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              UX/UI
            </h3>
            <div className="flex items-end justify-center">
              <img src={yukari} alt="Yukari Takeba" className="h-[180px] lg:h-[230px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>

          <div 
            onClick={() => handleTeamClick("3D")}
            className="flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-xl lg:text-2xl font-bold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              3D
            </h3>
            <div className="flex items-end justify-center gap-3">
              <img src={ken} alt="Ken Amada" className="h-[180px] lg:h-[230px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
              <img src={koromaru} alt="Koromaru" className="h-[90px] lg:h-[115px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>
        </div>

        {/* Bottom Row: Graphics | Music | Video */}
        <div className="grid grid-cols-4 gap-4 lg:gap-8 items-end justify-items-center w-full">
          <div 
            onClick={() => handleTeamClick("Graphics")}
            className="col-span-2 flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-xl lg:text-2xl font-bold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              Graphics
            </h3>
            <div className="flex items-end justify-center gap-3 lg:gap-4">
              <img src={akihiko} alt="Akihiko Sanada" className="h-[180px] lg:h-[230px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
              <img src={mitsuru} alt="Mitsuru Kirijo" className="h-[180px] lg:h-[230px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
              <img src={shinjiro} alt="Shinjiro Aragaki" className="h-[195px] lg:h-[245px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>

          <div 
            onClick={() => handleTeamClick("Music")}
            className="col-span-1 flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-xl lg:text-2xl font-bold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              Music
            </h3>
            <div className="flex items-end justify-center">
              <img src={junpei} alt="Junpei Iori" className="h-[180px] lg:h-[230px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>

          <div 
            onClick={() => handleTeamClick("Video")}
            className="col-span-1 flex flex-col items-center group cursor-pointer select-none active:scale-95 transition-transform duration-200"
          >
            <h3
              style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
              className="text-xl lg:text-2xl font-bold text-[#000024] mb-2 text-center transition-transform duration-200 group-hover:scale-105"
            >
              Video
            </h3>
            <div className="flex items-end justify-center">
              <img src={fuuka} alt="Fuuka Yamagishi" className="h-[165px] lg:h-[210px] object-contain object-bottom transition-transform duration-200 group-hover:scale-105" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}