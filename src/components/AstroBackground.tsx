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

    const ctx = context;
    const canvasElement = canvas;

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

      const pixelRatio = window.devicePixelRatio || 1;

      canvasElement.width = width * pixelRatio;
      canvasElement.height = height * pixelRatio;
      canvasElement.style.width = `${width}px`;
      canvasElement.style.height = `${height}px`;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0 || star.x > width) {
          star.vx *= -1;
        }

        if (star.y < 0 || star.y > height) {
          star.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
        ctx.fill();
      });

      for (let i = 0; i < stars.length; i += 1) {
        for (let j = i + 1; j < stars.length; j += 1) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECT_DISTANCE) {
            const opacity = 1 - distance / CONNECT_DISTANCE;

            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
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
    <div className="astro-background" aria-hidden="true">
      <img src={galaxyBg} alt="" className="astro-background-image" />
      <canvas ref={canvasRef} className="astro-background-canvas" />
    </div>
  );
}

export default AstroBackground;