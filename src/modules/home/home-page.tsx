import { FC } from "react";
import { GradientColor, GradientText } from "../../components/GradientText";
import { FaGithub, FaTwitter, FaDiscord, FaPaypal } from 'react-icons/fa';
import { SiKofi } from 'react-icons/si';
import { IconLink } from "../../components/IconLink";
import { IoMdMail } from 'react-icons/io';



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
                Amitoj Singh Chopra
            </GradientText>

            <div className="flex flex-row mt-20 space-x-10 md:space-x-16 h-10">
                <IconLink Icon={FaGithub} link="https://github.com/amitojsingh366/" title="Check out my GitHub profile" />
                <IconLink Icon={FaTwitter} link="https://twitter.com/amitojsingh366/" title="Check out my Twitter profile" />
                <IconLink Icon={FaDiscord} link="https://discord.com/users/473965680857972757" title="Contact me on Discord" />
                <IconLink Icon={IoMdMail} link="mailto:amitoj@amitoj.net" title="Contact me via E-Mail" />
                <IconLink Icon={SiKofi} link="https://ko-fi.com/amitoj" title="Buy me a coffee 💞" />
                <IconLink Icon={FaPaypal} link="https://paypal.me/amitoj366" title="Support me through PayPal 💞" />
            </div>
        </div>
    )
}
