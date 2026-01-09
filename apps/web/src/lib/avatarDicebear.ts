import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

export type AvatarOptions = {
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
  nose?: string[];

  accessories?: string[];
  accessoriesColor?: string[];
  accessoriesProbability?: number;

  facialHair?: string[];
  facialHairColor?: string[];
  facialHairProbability?: number;

  clothing?: string[];
  clothesColor?: string[];
  clothingGraphic?: string[];

  base?: string[];
};

export function renderAvatarSvg(seed: string, options: AvatarOptions = {}) {
  return createAvatar(avataaars, {
    seed,
    ...options,
  }).toString();
}
