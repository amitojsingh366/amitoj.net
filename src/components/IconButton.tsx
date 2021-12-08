import { ButtonHTMLAttributes, DetailedHTMLProps, FC, useContext } from "react";
import { IconType } from "react-icons";
import { ColorMode, ThemeContext } from "../modules/ThemeProvider";

export type IconButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    Icon: IconType,
    iconClassname?: string,
}

export const IconButton: FC<IconButtonProps> = ({
    Icon,
    onClick,
    className = "",
    title = "",
    iconClassname = "",
    ...props
}) => {
    const { colorMode } = useContext(ThemeContext);
    return (
        <button onClick={onClick} title={title} className={`flex flex-col items-center justify-center ${className}`} {...props}>
            <Icon
                title={title}
                className={`${colorMode === ColorMode.dark ? 'text-white' : 'text-black'} text-xl hover:text-3xl transition-all duration-500 ${iconClassname}`}
                style={{
                    filter: colorMode === ColorMode.dark ?
                        `drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.5)) drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.5))` :
                        `drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.5)) drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.5))`
                }} />
        </button>
    );
}