type Card = {
    code: string; // A unique code for the card, e.g., "2h" for Two of Hearts
    suit: Suit; // The suit of the card, one of HEARTS, DIAMONDS, CLUBS, SPADES
    rank: Rank; // The rank of the card, one of TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN, KING, ACE
    value: number; // The value of the card, used for scoring
    name: string; // The full name of the card, e.g., "Two of Hearts"
    shortName: string; // A short name for the card, e.g., "2♡" for Two of Hearts
}

enum Suit {
    HEARTS = "h",
    DIAMONDS = "d",
    CLUBS = "c",
    SPADES = "s"
}

enum Rank {
    TWO = "2",
    THREE = "3",
    FOUR = "4",
    FIVE = "5",
    SIX = "6",
    SEVEN = "7",
    EIGHT = "8",
    NINE = "9",
    TEN = "T",
    JACK = "J",
    QUEEN = "Q",
    KING = "K",
    ACE = "A"
}

export { type Card, Suit, Rank };