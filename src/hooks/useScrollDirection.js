import { useState, useEffect } from 'react';

/**
 * Custom hook to track scroll direction
 * @param {number} threshold - Minimum scroll needed to determine direction change
 * @returns {Object} - Contains isScrollingUp, isScrolledToTop, and scrollY values
 */
export default function useScrollDirection(threshold = 10) {
  const [scrollDirection, setScrollDirection] = useState({
    isScrollingUp: true,
    isScrolledToTop: true,
    scrollY: 0
  });
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const isScrolledToTop = scrollY < 10;
      
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      
      const isScrollingUp = scrollY < lastScrollY;
      
      setScrollDirection({
        isScrollingUp,
        isScrolledToTop,
        scrollY
      });
      
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };
    
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll);
    
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  
  return scrollDirection;
} 