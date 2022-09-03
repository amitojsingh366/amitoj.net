import { FC, useContext } from "react";
import { MoonIcon, SunIcon } from '@heroicons/react/solid'
import { IconButton } from "./IconButton";
import { ColorMode, ThemeContext } from "../modules/ThemeProvider";


export const Header: FC = () => {
    const { colorMode, setColorMode } = useContext(ThemeContext);
    const changeMode = () => {
        setColorMode(
            colorMode === ColorMode.dark ? ColorMode.light : ColorMode.dark
        )
    }

    return (
        <div className="flex flex-row w-full fixed justify-end p-5 transition-transform">
            <IconButton
                className={`w-5 ${colorMode === ColorMode.light && 'w-0 h-0'}`}
                iconClassname="h-5 hover:h-6"
                onClick={changeMode}
                Icon={SunIcon}
            />
            <IconButton
                className={`w-5 ${colorMode === ColorMode.dark && 'w-0 h-0'}`}
                iconClassname="h-5 hover:h-6"
                onClick={changeMode}
                Icon={MoonIcon}
            />
        </div>
    );
}