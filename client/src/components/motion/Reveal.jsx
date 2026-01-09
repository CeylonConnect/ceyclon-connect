import React, { useEffect, useRef, useState } from "react";

/**
 * Reveal
 * Wrap any content to animate it when it scrolls into view.
 * Uses Tailwind's existing animate-fade-in-up class from your config.
 *
 * Props:
 * - as?: element tag (default 'div')
 * - threshold?: IntersectionObserver threshold (default 0.18)
 * - once?: animate only the first time in view (default true)
 * - className?: extra classes
 */
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
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref}
      className={`${className} ${show ? "animate-fade-in-up" : "opacity-0 translate-y-3"}`}
    >
      {children}
    </Tag>
  );
}
