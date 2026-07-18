import { useEffect, useRef } from "react";
import galaxyBg from "../assets/galaxy-bg.png";

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

const STAR_COUNT = 76;
const CONNECT_DISTANCE = 130;

function AstroBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.6 + 0.55,
    }));

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function draw() {
      context.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0 || star.x > width) {
          star.vx *= -1;
        }

        if (star.y < 0 || star.y > height) {
          star.vy *= -1;
        }

        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 235, 184, 0.88)";
        context.fill();
      });

      for (let i = 0; i < stars.length; i += 1) {
        for (let j = i + 1; j < stars.length; j += 1) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECT_DISTANCE) {
            const opacity = 1 - distance / CONNECT_DISTANCE;

            context.beginPath();
            context.moveTo(stars[i].x, stars[i].y);
            context.lineTo(stars[j].x, stars[j].y);
            context.strokeStyle = `rgba(217, 173, 87, ${opacity * 0.24})`;
            context.lineWidth = 1;
            context.stroke();
          }
        }
      }

      animationFrame = requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="astro-bg-layer" aria-hidden="true">
      <img src={galaxyBg} alt="" className="astro-bg-image" />
      <canvas ref={canvasRef} className="astro-star-canvas" />
      <div className="astro-gold-vignette" />
    </div>
  );
}

export default AstroBackground;