import { useEffect, useRef } from 'react';

export function useScroll(...dependencies: any[]) {
  const ref = useRef<any>(null);
  useEffect(() => {
    const scrollToBottom = () => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [dependencies]);

  return ref;
}

export default {};
