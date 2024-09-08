  
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const canvasRef = useRef(null);
  const imgArray = useRef([]);
  const imagesLoaded = useRef(0);

  const frames = {
    currentIndex: 0,
    maxIndex: 196,
  };

  function preloadImages() {
    for (let i = 1; i <= frames.maxIndex; i++) {
      const imageUrl = `../src/assets/frames/frame_${i.toString().padStart(4, "0")}.jpeg`;

      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        imagesLoaded.current++;
        if (imagesLoaded.current === frames.maxIndex) {
          loadImage(frames.currentIndex);
          startAnimations();
        }
      };

      imgArray.current.push(img);
    }
  }

  function loadImage(index) {
    if (index >= 0 && index <= frames.maxIndex) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const img = imgArray.current[index];

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;

      const scale = Math.max(scaleX, scaleY);

      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      const offsetX = (canvas.width - newWidth) / 2;
      const offsetY = (canvas.height - newHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(img, offsetX, offsetY, newWidth, newHeight);

      frames.currentIndex = index;
    }
  }

  function startAnimations() {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".parent", 
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
        onUpdate: (self) => {
          // Map scroll progress to frame index
          const newIndex = Math.floor(
            self.progress * frames.maxIndex
          );
          if (newIndex !== frames.currentIndex) {
            loadImage(newIndex);
          }
        },
      },
    });
  }

  useEffect(() => {
    preloadImages();
  }, []);

  return (
    <>
      <div>
        <h1 className="w-full bg-zinc-900">
          <div className="parent relative top-0 left-0 w-full h-[700vh]">
            <div className="w-full sticky top-0 left-0 h-screen">
              <canvas ref={canvasRef} className="w-full h-screen" id="frame"></canvas>
            </div>
          </div>
        </h1>
      </div>
    </>
  );
}

export default App;
