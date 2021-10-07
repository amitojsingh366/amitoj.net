import create from "zustand";
import { combine } from "zustand/middleware";
import { isServer } from "../lib/constants";

const colorModeKey = "@app/colorMode";
export enum ColorMode {
    light = 'light',
    dark = 'dark'
}

const getDefaultValues = () => {
    if (!isServer) {
        try {
            return {
                mode: localStorage.getItem(colorModeKey) as ColorMode || ColorMode.dark,
            };
        } catch {
            return {
                mode: ColorMode.dark
            }
        }
    }

    return {
        mode: "",
    };

};

export const useColorMode = create(
    combine(getDefaultValues(), (set) => ({
        setColorMode: (x: { mode: ColorMode }) => {
            try {
                localStorage.setItem(colorModeKey, x.mode);
            } catch { }

            set(x);
        },
    }))
);