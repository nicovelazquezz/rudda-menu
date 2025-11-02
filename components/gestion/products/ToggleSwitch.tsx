"use client";

import React from "react";

export default function ToggleSwitch({
  checked,
  onChange,
  labelOn = "Promocionado",
  labelOff = "Promocionar",
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void | Promise<void>;
  labelOn?: string;
  labelOff?: string;
  disabled?: boolean;
}) {
  const label = checked ? labelOn : labelOff;

  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      onClick={onChange}
      onKeyDown={handleKey}
      disabled={disabled}
      className={[
        "inline-flex items-center gap-2 select-none",
        "text-xs text-black/70",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {/* pill */}
      <span
        className={[
          "relative inline-flex items-center h-5 w-9 rounded-full border",
          checked
            ? "bg-[#658c5f] border-[#658c5f]"
            : "bg-black/10 border-[#c4b8a8]",
        ].join(" ")}
      >
        {/* knob */}
        <span
          className={[
            "absolute h-4 w-4 rounded-full bg-white shadow transition-all",
            checked ? "right-0.5" : "left-0.5",
          ].join(" ")}
        />
      </span>

    </button>
  );
}
