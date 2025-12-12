import React, { useEffect, useRef, useState } from "react";

export default function Reveal({
  as: Tag = "div",
  threshold = 0.18,
  once = true,
  className = "",
  children,
}) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      setShow(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            setShow(true);
            if (once) io.unobserve(en.target);
          } else if (!once) {
            setShow(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

 
}