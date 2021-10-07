import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

export type TextSize = 'text-xs'
    | 'text-sm'
    | 'text-base'
    | 'text-lg'
    | 'text-xl'
    | 'text-2xl'
    | 'text-3xl'
    | 'text-4xl'
    | 'text-5xl'
    | 'text-6xl'
    | 'text-7xl'
    | 'text-8xl'
    | 'text-9xl'


export type FontWeight = 'font-thin'
    | 'font-extraLight'
    | 'font-light'
    | 'font-normal'
    | 'font-medium'
    | 'font-semibold'
    | 'font-bold'
    | 'font-extraBold'
    | 'font-black'

export enum GradientColor {
    'purple-pink-red' = 'from-purple-400 via-pink-500 to-red-500',
    'yellow-red-pink' = 'from-yellow-400 via-red-500 to-pink-500',
    'green-blue-purple' = 'from-green-400 via-blue-500 to-purple-400',
    'green-pink-blue' = 'from-green-400 via-pink-500 to-blue-500',
    'green-blue' = 'from-green-400 to-blue-500',
    'red-blue' = 'from-red-500 to-blue-500'
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

export type GradientTextType = DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
> & {
    size?: TextSize;
    smallSize?: TextSize;
    colors?: GradientColor;
    direction?: GradientDirection;
    fontWeight?: FontWeight;
}

export const GradientText: FC<GradientTextType> = ({
    children,
    style,
    className,
    size = 'text-base',
    smallSize = 'text-sm',
    colors = GradientColor["purple-pink-red"],
    direction = GradientDirection.right,
    fontWeight = 'font-normal',
}) => {
    size = 'lg:' + size as TextSize;
    return (
        <p
            className={`${smallSize} ${size} text-transparent bg-clip-text ${direction} 
            ${colors} ${fontWeight} ${className} p-1`}
            style={{
                ...style,
                fontFamily: 'Montserrat'
            }}
        >
            {children}
        </p>);
}