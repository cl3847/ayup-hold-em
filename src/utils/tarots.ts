import {MajorArcana, type Tarot} from "../types/TarotType.ts";

export const tarotList: Tarot[] = [
    {code: MajorArcana.FOOL, name: "Fool"},
    {code: MajorArcana.MAGICIAN, name: "Magician"},
    {code: MajorArcana.HIGH_PRIESTESS, name: "High Priestess"},
    {code: MajorArcana.EMPRESS, name: "Empress"},
    {code: MajorArcana.EMPEROR, name: "Emperor"},
    {code: MajorArcana.HIEROPHANT, name: "Hierophant"},
    {code: MajorArcana.LOVERS, name: "Lovers"},
    {code: MajorArcana.CHARIOT, name: "Chariot"},
    {code: MajorArcana.STRENGTH, name: "Strength"},
    {code: MajorArcana.HERMIT, name: "Hermit"},
    {code: MajorArcana.WHEEL_OF_FORTUNE, name: "Wheel of Fortune"},
    {code: MajorArcana.JUSTICE, name: "Justice"},
    {code: MajorArcana.HANGED_MAN, name: "Hanged Man"},
    {code: MajorArcana.DEATH, name: "Death"},
    {code: MajorArcana.TEMPERANCE, name: "Temperance"},
    {code: MajorArcana.DEVIL, name: "Devil"},
    {code: MajorArcana.TOWER, name: "Tower"},
    {code: MajorArcana.STAR, name: "Star"},
    {code: MajorArcana.MOON, name: "Moon"},
    {code: MajorArcana.SUN, name: "Sun"},
    {code: MajorArcana.JUDGEMENT, name: "Judgement"},
    {code: MajorArcana.WORLD, name: "World"},
];

export const tarotMap = new Map<string, { code: MajorArcana, name: string }>();
tarotList.forEach(c => {
    tarotMap.set(c.code, c);
});