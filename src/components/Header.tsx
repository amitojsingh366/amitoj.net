import { FC, useContext } from "react";
import { IconButton } from "./IconButton";
import { ColorMode, ThemeContext } from "../modules/ThemeProvider";
import { IoMdMoon, IoMdSunny } from 'react-icons/io'


export const Header: FC = () => {
    const { colorMode, setColorMode } = useContext(ThemeContext);
    const changeMode = () => {
        setColorMode(
            colorMode === ColorMode.dark ? ColorMode.light : ColorMode.dark
        )
    }

    return (
        <div className="flex flex-row w-full fixed justify-end p-5 transition-transform">
            {colorMode !== ColorMode.light && <IconButton
                className={`w-5 `}
                iconClassname="h-5 hover:h-6"
                onClick={changeMode}
                Icon={IoMdSunny}
            />}
            {colorMode !== ColorMode.dark && <IconButton
                className={`w-5 `}
                iconClassname="h-5 hover:h-6"
                onClick={changeMode}
                Icon={IoMdMoon}
            />}
        </div>
    );
}