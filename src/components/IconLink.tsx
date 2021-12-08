import { ButtonHTMLAttributes, DetailedHTMLProps, FC, useContext } from "react";
import { IconType } from "react-icons";
import { ColorMode, ThemeContext } from "../modules/ThemeProvider";

export type IconLinkProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
> & {
    Icon: IconType,
    link: string,
}

export const IconLink: FC<IconLinkProps> = ({
    Icon,
    link,
    className = "",
    title = "",
    ...props
}) => {
    const { colorMode } = useContext(ThemeContext);
    return (
        <a href={link} className={`flex flex-col items-center justify-center ${className}`} title={title} {...props}>
            <Icon
                title={title}
                className={`${colorMode === ColorMode.dark ? 'text-white' : 'text-black'} text-xl hover:text-3xl transition-all duration-500`}
                style={{
                    filter: colorMode === ColorMode.dark ?
                        `drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.5)) drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.5))` :
                        `drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.5)) drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.5))`
                }} />
        </a>
    );
}