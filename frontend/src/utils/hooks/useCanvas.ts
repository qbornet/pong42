import { useEffect, useRef } from 'react';

export function useCanvas(draw: (context: CanvasRenderingContext2D) => void) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    let animationFrameId: number;
    if (canvas) {
      const context = canvas?.getContext('2d');

      const refCanva = { width: canvas.width, height: canvas.height };
      const renderer = () => {
        if (context && canvas) {
          const scale = Math.min(
            window.innerWidth - 100 < refCanva.width
              ? (window.innerWidth - 100) / refCanva.width
              : 1,
            window.innerHeight - 100 < refCanva.height
              ? (window.innerHeight - 100) / refCanva.height
              : 1
          );

          const origin = {
            x: (canvas.width - refCanva.width * scale) / 2,
            y: (canvas.height - refCanva.height * scale) / 2
          };
          context.clearRect(-10, -10, canvas.width + 100, canvas.height + 100);
          context.setTransform(scale, 0, 0, scale, origin.x, origin.y);

          draw(context);
        }
        animationFrameId = window.requestAnimationFrame(renderer);
      };
      renderer();
    }
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return ref;
}
