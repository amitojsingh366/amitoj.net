import { FC } from "react";
import { GradientColor, GradientText } from "../../components/GradientText";
import { IconLink } from "../../components/IconLink";
import { links } from '../../../constants'


export const HomePage: FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <GradientText
                className='text-5xl md:text-7xl'
                fontWeight='font-bold'
                colors={GradientColor["green-blue"]}
                style={{
                    textShadow: '0px 0px 50px rgba(52, 211, 153, 0.4)'
                }}
            >
                Amitoj Singh
            </GradientText>

            <div className="flex flex-row mt-20 space-x-10 md:space-x-16 h-10">
                {links.map((link, index) => <IconLink key={index} Icon={link.icon} link={link.url} title={link.description} />)}
            </div>
        </div>
    )
}
