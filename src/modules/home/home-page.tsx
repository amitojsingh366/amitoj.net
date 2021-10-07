import { FC } from "react";
import { Headers } from "../../components/Headers";
import { GradientColor, GradientText } from "../../components/GradientText";
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { AiFillInstagram } from 'react-icons/ai';
import { IconLink } from "../../components/IconLink";
import { IoMdMail } from 'react-icons/io';

export const HomePage: FC = () => {

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <Headers
                title="Amitoj Singh"
                des="Amitoj Singh"
                image="https://avatars.githubusercontent.com/u/35400192?v=4" />

            <GradientText
                size='text-7xl'
                fontWeight='font-bold'
                colors={GradientColor["green-blue-purple"]}
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