export type ThemeMode = "light" | "dark";

export function setThemeWithAnimation(
  setTheme: (theme: ThemeMode) => void,
  nextTheme: ThemeMode,
  clickEvent?: React.MouseEvent
) {
  if (
    typeof document === "undefined" ||
    !document.startViewTransition ||
    !clickEvent
  ) {
    setTheme(nextTheme);
    return;
  }

  const x = clickEvent.clientX;
  const y = clickEvent.clientY;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  document.documentElement.style.setProperty("--theme-reveal-x", `${x}px`);
  document.documentElement.style.setProperty("--theme-reveal-y", `${y}px`);
  document.documentElement.style.setProperty("--theme-reveal-r", `${radius}px`);

  document.documentElement.classList.add("theme-transition-active");

  const transition = document.startViewTransition(() => {
    setTheme(nextTheme);
  });

  transition.finished.finally(() => {
    document.documentElement.classList.remove("theme-transition-active");
  });
}
