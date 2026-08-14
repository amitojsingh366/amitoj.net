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
  availability: "Available for Fall 2026 & Winter 2027 internships",
  description:
    "Computer science student and software engineer on Vancouver Island. I build products end to end, from mobile apps and hardware wallets to AI scheduling systems and multi-cloud Kubernetes infrastructure. I like owning the parts most people skip: releases, DNS, and uptime.",
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
