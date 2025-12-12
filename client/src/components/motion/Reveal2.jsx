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

  return (
    <Tag
      ref={ref}
      className={[
        className,
        "transition-all duration-700 ease-out will-change-transform transform-gpu",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        "motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0",
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}