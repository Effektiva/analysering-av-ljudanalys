import { useState, useEffect, useRef } from "react";

/*
  Custom hook that sets its isComponentVisible to false if a click is
  seen outside the given ref (HTMLDivElement). See ContextMenu.tsx for a usage example.

  Shamelessly taken from:
  https://stackoverflow.com/questions/32553158/detect-click-outside-react-component/42234988#42234988
*/
export default function useComponentVisible(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains((event.target as Node))) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
