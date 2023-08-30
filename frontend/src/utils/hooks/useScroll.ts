import { useEffect, useRef, useState } from 'react';

export function useScroll(...dependencies: any[]) {
  const [close, setClose] = useState<boolean>(true);

  const messageEndRef = useRef<any>(null);
  useEffect(() => {
    const scrollToBottom = () => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [dependencies]);

  return { messageEndRef, close, setClose };
}

export default {};
