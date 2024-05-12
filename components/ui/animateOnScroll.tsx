import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  reappear?: boolean;
  threshold?: number;
  direction: string;
};

type Options = {
  threshold: number;
  reappear?: boolean;
};

const useElementOnScreen = (
  options: Options,
): [React.RefObject<HTMLDivElement>, boolean] => {
  const containerRef = useRef<HTMLDivElement>(null);
  console.log("containerRef:", containerRef);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const makeAppear = (entries: any) => {
    const [entry] = entries;
    if (entry.isIntersecting) setIsVisible(true);
  };

  const makeAppearRepeating = (entries: any) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  const callBack = options.reappear ? makeAppearRepeating : makeAppear;

  useEffect(() => {
    const containerRefCurrent = containerRef.current;
    const observer = new IntersectionObserver(callBack, options);
    if (containerRefCurrent) observer.observe(containerRefCurrent);

    return () => {
      if (containerRefCurrent) {
        observer.unobserve(containerRefCurrent);
      }
    };
  }, [containerRef, options, callBack]);

  return [containerRef, isVisible];
};

const AnimateOnScroll = ({
  children,
  reappear,
  threshold = 0.5,
  direction,
}: Props) => {
  const [containerRef, isVisible] = useElementOnScreen({
    threshold: threshold,
    reappear: reappear,
  });

  return (
    <>
      {direction === "left" && (
        <div
          ref={containerRef}
          className={`transition duration-1000 ${isVisible ? `opacity-100 blur-none translate-x-0` : `opacity-0 blur-lg translate-x-20`}  motion-reduce:transition-none motion-reduce:hover:transform-none`}
        >
          {children}
        </div>
      )}
      {direction === "right" && (
        <div
          ref={containerRef}
          className={`transition duration-1000 ${isVisible ? `opacity-100 blur-none translate-x-0` : `opacity-0 blur-lg -translate-x-20`}  motion-reduce:transition-none motion-reduce:hover:transform-none`}
        >
          {children}
        </div>
      )}
      {direction === "down" && (
        <div
          ref={containerRef}
          className={`transition duration-1000 ${isVisible ? `opacity-100 blur-none translate-y-0` : `opacity-0 blur-lg -translate-y-20`}  motion-reduce:transition-none motion-reduce:hover:transform-none`}
        >
          {children}
        </div>
      )}
      {direction === "top" && (
        <div
          ref={containerRef}
          className={`transition duration-1000 ${isVisible ? `opacity-100 blur-none translate-y-0` : `opacity-0 blur-lg translate-y-20`}  motion-reduce:transition-none motion-reduce:hover:transform-none`}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default AnimateOnScroll;