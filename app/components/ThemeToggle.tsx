import { useState } from "react";
import { Icon } from "~/components/Icon";
import { commitTheme, cycleTheme, type Theme } from "~/utils/theme";

const SLOTS: { theme: Theme; icon: "Sun" | "Desktop" | "Moon"; label: string }[] = [
  { theme: "light", icon: "Sun", label: "Light" },
  { theme: "system", icon: "Desktop", label: "System" },
  { theme: "dark", icon: "Moon", label: "Dark" },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(
    () => (typeof document !== "undefined" ? (document.documentElement.dataset.theme as Theme) : undefined) ?? "system"
  );

  function handleClick() {
    const next = cycleTheme(theme);
    commitTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      aria-label={`Switch theme (currently ${SLOTS.find((slot) => slot.theme === theme)?.label})`}
      onClick={handleClick}
      className="inline-flex items-center rounded-full border border-border p-0.5"
    >
      {SLOTS.map((slot) => (
        <span
          key={slot.theme}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
            theme === slot.theme
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          }`}
        >
          {theme === slot.theme && <Icon name={slot.icon} size={16} />}
        </span>
      ))}
    </button>
  );
}
