import React, { useEffect, useRef, useState } from "react";

export default function Reveal({
  as: Tag = "div",
  threshold = 0.18,
  once = true,
  className = "",
  children,
})  {
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