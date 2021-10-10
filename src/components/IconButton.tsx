import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";
import { IconType } from "react-icons";
import { ColorMode } from "../hooks/useColorMode";

export type IconButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    Icon: IconType,
    iconClassname?: string,
    colorMode: ColorMode
}

export const IconButton: FC<IconButtonProps> = ({
    Icon,
    onClick,
    colorMode = ColorMode.dark,
    className = "",
    iconClassname = "",
}) => {

    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center ${className}`}>
            <Icon className={`${colorMode === ColorMode.dark ? 'text-white' : 'text-black'} text-xl hover:text-3xl transition-all duration-500 ${iconClassname}`}
                style={{
                    filter: colorMode === ColorMode.dark ?
                        `drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.5)) drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.5))` :
                        `drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.5)) drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.5))`
                }} />
        </button>
    );
}