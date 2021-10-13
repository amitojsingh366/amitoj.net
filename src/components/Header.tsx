import { FC } from "react";
import { MoonIcon, SunIcon } from '@heroicons/react/solid'
import { ColorMode, useColorMode } from "../hooks/useColorMode";
import { IconButton } from "./IconButton";

export type HeaderProps = {
    colorMode: ColorMode
}

export const Header: FC<HeaderProps> = ({ colorMode }) => {

    const changeMode = () => {
        useColorMode.getState().setColorMode({
            mode: useColorMode.getState().mode === ColorMode.dark ? ColorMode.light : ColorMode.dark
        })
    }

    return (
        <div className="flex flex-row w-full fixed justify-end p-5">
            <IconButton
                className="w-5 "
                iconClassname="h-5 hover:h-6"
                onClick={changeMode}
                Icon={colorMode === ColorMode.dark ? SunIcon : MoonIcon}
                colorMode={colorMode}
            />
        </div>
    );
}