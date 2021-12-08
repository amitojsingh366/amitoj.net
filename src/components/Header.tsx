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
        <div className="flex flex-row w-full fixed justify-end p-5">
            <IconButton
                className="w-5 "
                iconClassname="h-5 hover:h-6"
                onClick={changeMode}
                Icon={colorMode === ColorMode.dark ? SunIcon : MoonIcon}
            />
        </div>
    );
}