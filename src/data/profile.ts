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
  availability: "Available for full-time SWE · 2026",
  description:
    "Software engineer from Vancouver Island. I build systems end to end — trading pipelines, hardware bridges, desktop wallets, mobile apps — and I like owning the parts most people skip: releases, DNS, uptime.",
  stats: [
    { value: "230K+", label: "LOC merged, open source" },
    { value: "06", label: "Years shipping" },
  ],
  location: {
    place: "Van Isle",
    timezone: "PST",
  },
  contactHeading: "Let's ship something",
  historyRange: "2021 → Now",
};
