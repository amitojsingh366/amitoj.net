import { FC } from "react";

export enum TextSize {
    xs = 'xs',
    sm = 'sm',
    base = 'base',
    lg = 'lg',
    xl = 'xl',
    '2xl' = '2xl',
    '3xl' = '3xl',
    '4xl' = '4xl',
    '5xl' = '5xl',
    '6xl' = '6xl',
    '7xl' = '7xl',
    '8xl' = '8xl',
    '9xl' = '9xl',
}

export enum FontWeight {
    thin = 'font-thin',
    extraLight = 'font-extraLight',
    light = 'font-light',
    normal = 'font-normal',
    medium = 'font-medium',
    semibold = 'font-semibold',
    bold = 'font-bold',
    extraBold = 'font-extraBold',
    black = 'font-black',
}

export enum GradientColor {
    'purple-pink-red' = 'from-purple-400 via-pink-500 to-red-500',
    'yellow-red-pink' = 'from-yellow-400 via-red-500 to-pink-500',
    'green-blue-purple' = 'from-green-400 via-blue-500 to-purple-400',
    'green-pink-blue' = 'from-green-400 via-pink-500 to-blue-500',
    'green-blue' = 'from-green-400 to-blue-500',
}

export enum GradientDirection {
    right = 'bg-gradient-to-r',
    left = 'bg-gradient-to-l',
    top = 'bg-gradient-to-t',
    bottom = 'bg-gradient-to-b',
    topRight = 'bg-gradient-to-tr',
    topLeft = 'bg-gradient-to-tl',
    bottomRight = 'bg-gradient-to-br',
    bottomLeft = 'bg-gradient-to-bl',
}

export type GradientTextType = {
    size?: TextSize;
    colors?: GradientColor;
    direction?: GradientDirection;
    fontWeight?: FontWeight;
    className?: string
}

export const GradientText: FC<GradientTextType> = ({
    children,
    size = TextSize.base,
    colors = GradientColor["purple-pink-red"],
    direction = GradientDirection.right,
    fontWeight = FontWeight.normal,
    className = '',
}) => {
    return (
        <p
            className={`text-${size} text-transparent bg-clip-text ${direction} 
            ${colors} ${fontWeight} ${className} p-1`}
            style={{ fontFamily: 'Montserrat' }}
        >
            {children}
        </p>);
}