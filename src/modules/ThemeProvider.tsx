"use client";

import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ColorMode, THEME_COOKIE, THEME_LS_KEY } from "./theme";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

export const ThemeContext = createContext<{
  colorMode: ColorMode;
  setColorMode: Dispatch<SetStateAction<ColorMode>>;
}>({
  colorMode: ColorMode.dark,
  setColorMode: () => {},
});

export function ThemeProvider({
  initialTheme,
  children,
}: PropsWithChildren<{ initialTheme: ColorMode }>) {
  const [colorMode, setColorModeRaw] = useState(initialTheme);

  const setColorMode: Dispatch<SetStateAction<ColorMode>> = useCallback(
    (action) => {
      setColorModeRaw((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        setCookie(THEME_COOKIE, next);
        try {
          localStorage.setItem(THEME_LS_KEY, next);
        } catch {}
        return next;
      });
    },
    [],
  );

  // Migrate localStorage → cookie for users who had a preference before cookies
  useEffect(() => {
    try {
      const hasCookie = document.cookie.includes(`${THEME_COOKIE}=`);
      if (!hasCookie) {
        const saved = localStorage.getItem(THEME_LS_KEY);
        if (saved === ColorMode.light || saved === ColorMode.dark) {
          setCookie(THEME_COOKIE, saved);
          setColorModeRaw(saved);
        }
      }
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (colorMode === ColorMode.dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [colorMode]);

  return (
    <ThemeContext.Provider
      value={useMemo(() => ({ colorMode, setColorMode }), [colorMode, setColorMode])}
    >
      {children}
    </ThemeContext.Provider>
  );
}
