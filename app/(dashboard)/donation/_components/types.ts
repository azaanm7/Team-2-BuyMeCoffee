export type Profile = {
  id: number;
  name: string;
  about: string;
  socialUrl: string;
  photo: string | null;
  coverImage: string | null;
};

export type Donation = {
  id: string;
  name: string;
  avatar: string | null;
  amount: number;
  message: string;
  createdAt: string;
};

export const AMOUNTS = [1, 2, 5, 10] as const;

export const DEFAULT_PROFILE: Profile = {
  id: 1,
  name: "Jake",
  about:
    "I'm a typical person who enjoys exploring different things. I also make music art as a hobby. Follow me along.",
  socialUrl: "https://buymeacoffee.com/spacerulz44",
  photo: null,
  coverImage: null,
};
