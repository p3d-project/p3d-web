//This is a simple carousel component that displays a set of images
import { useState } from "react";
import rect5 from "../../assets/Rectangle_5.png";
import rect6 from "../../assets/Rectangle_6.png";
import rect7 from "../../assets/Rectangle_7.png";

export default Carousel;
const images = [rect7.src, rect5.src, rect6.src];

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className="relative h-full w-full object-cover">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        aria-label="Previous image"
        onClick={handlePrev}
        className="absolute top-1/2 left-[-20px] flex h-8 w-8 -translate-x-1/2 -translate-y-2 items-center justify-center rounded-full bg-[#12A858] text-xl text-white transition hover:scale-105"
      >
        &#10094;
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={handleNext}
        className="absolute top-1/2 right-[-20px] flex h-8 w-8 translate-x-1/2 -translate-y-2 items-center justify-center rounded-full bg-[#12A858] text-xl text-white transition hover:scale-105"
      >
        &#10095;
      </button>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to image ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 w-3 rounded-full transition ${
              currentIndex === index
                ? "bg-green-600"
                : "bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
