export interface ProfileStat {
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  initials: string;
  availability: string;
  description: string;
  stats: ProfileStat[];
  location: {
    place: string;
    timezone: string;
  };
  contactHeading: string;
  historyRange: string;
}

export const profile: Profile = {
  name: "Amitoj Singh",
  initials: "A/S",
  availability: "Available for Winter & Summer 2027 co-ops",
  description:
    "B.Sc. Computer Science student at VIU with a Management minor, graduating Spring 2028. Dean's List, 2025–26. I build products end to end, from mobile apps and hardware wallets to robotics, AI tools, and cloud infrastructure.",
  stats: [
    { value: "200K+", label: "Users across shipped products" },
    { value: "06", label: "Years shipping" },
  ],
  location: {
    place: "Van Isle",
    timezone: "PST",
  },
  contactHeading: "Let's ship something",
  historyRange: "2021 → Now",
};
