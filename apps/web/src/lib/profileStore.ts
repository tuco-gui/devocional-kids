const KEY = "devokids_profile_v5";

export type Gender = "boy" | "girl";

export type Extras = {
  earring?: "none" | "star" | "hoop";
  hairclip?: "none" | "bow" | "clip";
};

export type Profile = {
  name: string;
  gender: Gender;
  photoDataUrl?: string;

  avatar: {
    seed: string;
    options: {
      style?: ("default" | "circle")[];
      backgroundColor?: string[];

      skinColor?: string[];

      top?: string[];
      topProbability?: number;

      hairColor?: string[];
      hatColor?: string[];

      eyes?: string[];
      eyebrows?: string[];
      mouth?: string[];

      accessories?: string[];
      accessoriesProbability?: number;

      facialHair?: string[];
      facialHairProbability?: number;

      clothing?: string[];
      clothesColor?: string[];
      clothingGraphic?: string[];
    };
    extras: Extras;
  };
};

const DEFAULT_PROFILE: Profile = {
  name: "Criança",
  gender: "boy",
  avatar: {
    seed: "devokids",
    options: {
      style: ["circle"],
      backgroundColor: ["e66767"],
      skinColor: ["f2d3b1"],

      top: ["shortFlat"],
      topProbability: 100,
      hairColor: ["2c1b18"],

      eyes: ["default"],
      eyebrows: ["defaultNatural"],
      mouth: ["smile"],

      // óculos: começa sem
      accessories: ["round"],
      accessoriesProbability: 0,

      // barba: começa sem
      facialHair: ["beardLight"],
      facialHairProbability: 0,

      clothing: ["hoodie"],
      clothesColor: ["65c9ff"],
    },
    extras: {
      earring: "none",
      hairclip: "none",
    },
  },
};

export function loadProfile(): Profile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed) return DEFAULT_PROFILE;

    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      avatar: {
        ...DEFAULT_PROFILE.avatar,
        ...(parsed.avatar || {}),
        options: {
          ...DEFAULT_PROFILE.avatar.options,
          ...((parsed.avatar && parsed.avatar.options) || {}),
        },
        extras: {
          ...DEFAULT_PROFILE.avatar.extras,
          ...((parsed.avatar && parsed.avatar.extras) || {}),
        },
      },
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(p: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}
