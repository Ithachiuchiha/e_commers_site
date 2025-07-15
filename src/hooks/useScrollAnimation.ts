import { useEffect } from 'react';

interface AnimationOptions {
  threshold?: number;
  rootMargin?: string;
  unobserveOnce?: boolean;
}

export const useScrollAnimation = (
  selector: string, 
  animatedClass: string = 'reveal-visible',
  options: AnimationOptions = {}
) => {
  useEffect(() => {
    const { 
      threshold = 0.1, 
      rootMargin = '0px', 
      unobserveOnce = true 
    } = options;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animatedClass);
            
            if (unobserveOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!unobserveOnce) {
            entry.target.classList.remove(animatedClass);
          }
        });
      },
      { threshold, rootMargin }
    );

    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [selector, animatedClass, options]);
};

export default useScrollAnimation;