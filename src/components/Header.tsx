import { FC } from "react";
import { MoonIcon, SunIcon } from '@heroicons/react/solid'
import { ColorMode, useColorMode } from "../hooks/useColorMode";

export const Header: FC = () => {
    const colorMode = useColorMode().mode;

    const changeMode = () => {
        useColorMode.getState().setColorMode({
            mode: useColorMode.getState().mode === ColorMode.dark ? ColorMode.light : ColorMode.dark
        })
    }

    return (
        <div className="flex flex-row w-full text-white fixed justify-end p-5">
            <SunIcon
                onClick={changeMode}
                className={`cursor-pointer  h-5 w-5 bg-transparent transition-all duration-500 ${colorMode === ColorMode.dark ? '' : 'hidden'}`}
                style={{
                    filter: 'drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.5)) drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.5))'
                }}
            />

            <MoonIcon
                onClick={changeMode}
                className={`cursor-pointer  h-5 w-5 bg-transparent transition-all text-black duration-500 ${colorMode === ColorMode.dark ? 'hidden' : ''}`}
                style={{
                    filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.6)) drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.6))'
                }} />
        </div>
    );
}