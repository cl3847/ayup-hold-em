export type Tarot = {
    code: MajorArcana; // The unique code for the tarot card, corresponding to MajorArcana enum
    name: string; // The full name of the tarot card, e.g., "Fool"
}

export enum MajorArcana {
    FOOL = "fool",
    MAGICIAN = "magician",
    HIGH_PRIESTESS = "high_priestess",
    EMPRESS = "empress",
    EMPEROR = "emperor",
    HIEROPHANT = "hierophant",
    LOVERS = "lovers",
    CHARIOT = "chariot",
    STRENGTH = "strength",
    HERMIT = "hermit",
    WHEEL_OF_FORTUNE = "wheel_of_fortune",
    JUSTICE = "justice",
    HANGED_MAN = "hanged_man",
    DEATH = "death",
    TEMPERANCE = "temperance",
    DEVIL = "devil",
    TOWER = "tower",
    STAR = "star",
    MOON = "moon",
    SUN = "sun",
    JUDGEMENT = "judgement",
    WORLD = "world",
}

