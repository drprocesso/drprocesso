import { useEffect, useRef } from 'react';

interface UsePassiveEventListenerOptions {
  passive?: boolean;
  capture?: boolean;
}

export function usePassiveEventListener<T extends keyof WindowEventMap>(
  eventType: T,
  handler: (event: WindowEventMap[T]) => void,
  options: UsePassiveEventListenerOptions = { passive: true }
) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventHandler = (event: WindowEventMap[T]) => {
      handlerRef.current(event);
    };

    window.addEventListener(eventType, eventHandler, options);

    return () => {
      window.removeEventListener(eventType, eventHandler, options);
    };
  }, [eventType, options]);
}