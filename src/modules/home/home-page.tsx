import { FC } from "react";
import { GradientColor, GradientText } from "../../components/GradientText";
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import { IconLink } from "../../components/IconLink";
import { IoMdMail } from 'react-icons/io';

export const HomePage: FC = () => {

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
                <IconLink Icon={FaGithub} link="https://github.com/amitojsingh366/" />
                <IconLink Icon={FaTwitter} link="https://twitter.com/amitojsingh366/" />
                <IconLink Icon={AiFillInstagram} link="https://www.instagram.com/amltoj/" />
                <IconLink Icon={IoMdMail} link="mailto:amitoj@amitoj.net" />
            </div>


        </div>
    )
}