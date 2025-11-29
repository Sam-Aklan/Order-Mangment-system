"use client"

import { useState, useEffect } from 'react';
import useDebounce from './useDebounce';

interface WindowSize {
  width: number ;
  height: number ;
}

function useWindowSize(debounceDelay = 300) {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width:0,
    height: 0,
  });

  const debouncedWindowSize = useDebounce(windowSize, debounceDelay);
  const [isMobile,setIsMobile] = useState(debouncedWindowSize?.width < 768?true:false)

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window?.innerWidth || 0,
        height: window?.innerHeight || 0,
      });
      setIsMobile(debouncedWindowSize.width <768)
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(()=>{

    setIsMobile(debouncedWindowSize.width < 768)
  },[debouncedWindowSize.width])

  return {isMobile,debouncedWindowSize};
}

export default useWindowSize;
