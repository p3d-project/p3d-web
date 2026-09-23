//This is a simple carousel component that displays a set of images
import { useState } from "react";
import rect5 from "../../assets/Rectangle_5.png";
import rect6 from "../../assets/Rectangle_6.png";
import rect7 from "../../assets/Rectangle_7.png";

export default Carousel;
const images = [
    rect7.src,
    rect5.src,
    rect6.src,
]

function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="relative w-full h-full">
            <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="w-full h-full object-cover" />
            <button
                onClick={handlePrev}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
            >
                &#10094;
            </button>
            <button
                onClick={handleNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
            >
                &#10095;
            </button>
        </div>
    );
}
