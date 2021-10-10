import { FC } from "react";
import { GradientColor, GradientText } from "../../components/GradientText";
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
import { IconLink } from "../../components/IconLink";
import { IoMdMail } from 'react-icons/io';
import { ColorMode } from "../../hooks/useColorMode";

export type HomePageProps = {
    colorMode: ColorMode
}

export const HomePage: FC<HomePageProps> = ({ colorMode }) => {

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">

            <GradientText
                size='text-5xl'
                fontWeight='font-bold'
                colors={GradientColor["green-blue"]}
                style={{
                    textShadow: '0px 0px 50px rgba(52, 211, 153, 0.4)'
                }}
            >
                Amitoj Singh
            </GradientText>

            <div className="flex flex-row mt-20 space-x-16 h-10">
                <IconLink colorMode={colorMode} Icon={FaGithub} link="https://github.com/amitojsingh366/" />
                <IconLink colorMode={colorMode} Icon={FaTwitter} link="https://twitter.com/amitojsingh366/" />
                <IconLink colorMode={colorMode} Icon={FaDiscord} link="https://discords.com/bio/p/amitoj" />
                <IconLink colorMode={colorMode} Icon={IoMdMail} link="mailto:amitoj@amitoj.net" />
            </div>
        </div>
    )
}