import React from "react";

export default function FloatingInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  className = "",
  autoComplete,
  ...rest
}) {
  return (
    <div className="floating-field">
      <div
        className={[
          "relative",
          error ? "floating-error" : "",
        ].join(" ")}
      >
        {/* Use placeholder=' ' to enable peer-placeholder-shown */}
        <input
          id={name}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          placeholder=" "
          className={[
            "peer block w-full h-12 rounded-xl border px-3 pt-3 text-sm text-neutral-900",
            "bg-white outline-none transition",
            "border-neutral-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30",
            "autofill:shadow-[inset_0_0_0px_1000px_#fff] autofill:text-neutral-900", // for modern Tailwind w/ plugin
            className,
          ].join(" ")}
          {...rest}
        />

        <label
          htmlFor={name}
          className={[
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
            "bg-white px-1 text-[13px] text-neutral-500 transition-all",
            // Float on focus or when there's value (not placeholder-shown)
            "peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:scale-90 peer-focus:text-orange-600",
            "peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:scale-90",
            // Also float when autofilled (handled by CSS in index.css)
          ].join(" ")}
        >
          {label}
        </label>
      </div>

      {error && (
        <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>
      )}
    </div>
  );
}
