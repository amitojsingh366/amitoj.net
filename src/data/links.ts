import { IconType } from "react-icons";
import {
  FaGithub,
  FaTwitter,
  FaDiscord,
  FaPaypal,
  FaLinkedin,
} from "react-icons/fa";
import { SiKofi } from "react-icons/si";
import { IoMdMail } from "react-icons/io";

export interface SocialLink {
  name: string;
  url: string;
  description: string;
  path: string;
  icon: IconType;
}

export const socialLinks: SocialLink[] = [
  {
    name: "Github",
    url: "https://github.com/amitojsingh366/",
    path: "/github",
    description: "Check out my GitHub profile",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/amitojsingh366/",
    path: "/linkedin",
    description: "Connect with me on LinkedIn",
    icon: FaLinkedin,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/amitojsingh366/",
    path: "/twitter",
    description: "Check out my Twitter profile",
    icon: FaTwitter,
  },
  {
    name: "Discord",
    url: "https://discord.com/users/473965680857972757",
    path: "/discord",
    description: "Contact me on Discord",
    icon: FaDiscord,
  },
  {
    name: "E-Mail",
    url: "mailto:amitoj@amitoj.net",
    path: "/mail",
    description: "Contact me via E-Mail",
    icon: IoMdMail,
  },
  {
    name: "Ko-Fi",
    url: "https://ko-fi.com/amitoj",
    path: "/kofi",
    description: "Buy me a coffee",
    icon: SiKofi,
  },
  {
    name: "Paypal",
    url: "https://paypal.me/amitoj366",
    path: "/paypal",
    description: "Support me through PayPal",
    icon: FaPaypal,
  },
];
