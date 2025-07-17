import {type Card, Suit, Rank} from "../types/CardType.ts";

const cardList: Card[] = [
    // DIAMONDS
    { code: "2d", suit: Suit.DIAMONDS, rank: Rank.TWO,   value: 2,  name: "Two of Diamonds",   shortName: "2♦" },
    { code: "3d", suit: Suit.DIAMONDS, rank: Rank.THREE, value: 3,  name: "Three of Diamonds", shortName: "3♦" },
    { code: "4d", suit: Suit.DIAMONDS, rank: Rank.FOUR,  value: 4,  name: "Four of Diamonds",  shortName: "4♦" },
    { code: "5d", suit: Suit.DIAMONDS, rank: Rank.FIVE,  value: 5,  name: "Five of Diamonds",  shortName: "5♦" },
    { code: "6d", suit: Suit.DIAMONDS, rank: Rank.SIX,   value: 6,  name: "Six of Diamonds",   shortName: "6♦" },
    { code: "7d", suit: Suit.DIAMONDS, rank: Rank.SEVEN, value: 7,  name: "Seven of Diamonds", shortName: "7♦" },
    { code: "8d", suit: Suit.DIAMONDS, rank: Rank.EIGHT, value: 8,  name: "Eight of Diamonds", shortName: "8♦" },
    { code: "9d", suit: Suit.DIAMONDS, rank: Rank.NINE,  value: 9,  name: "Nine of Diamonds",  shortName: "9♦" },
    { code: "Td", suit: Suit.DIAMONDS, rank: Rank.TEN,   value: 10, name: "Ten of Diamonds",   shortName: "T♦" },
    { code: "Jd", suit: Suit.DIAMONDS, rank: Rank.JACK,  value: 10, name: "Jack of Diamonds",  shortName: "J♦" },
    { code: "Qd", suit: Suit.DIAMONDS, rank: Rank.QUEEN, value: 10, name: "Queen of Diamonds", shortName: "Q♦" },
    { code: "Kd", suit: Suit.DIAMONDS, rank: Rank.KING,  value: 10, name: "King of Diamonds",  shortName: "K♦" },
    { code: "Ad", suit: Suit.DIAMONDS, rank: Rank.ACE,   value: 11, name: "Ace of Diamonds",   shortName: "A♦" },

    // HEARTS
    { code: "2h", suit: Suit.HEARTS, rank: Rank.TWO,   value: 2,  name: "Two of Hearts",   shortName: "2♥" },
    { code: "3h", suit: Suit.HEARTS, rank: Rank.THREE, value: 3,  name: "Three of Hearts", shortName: "3♥" },
    { code: "4h", suit: Suit.HEARTS, rank: Rank.FOUR,  value: 4,  name: "Four of Hearts",  shortName: "4♥" },
    { code: "5h", suit: Suit.HEARTS, rank: Rank.FIVE,  value: 5,  name: "Five of Hearts",  shortName: "5♥" },
    { code: "6h", suit: Suit.HEARTS, rank: Rank.SIX,   value: 6,  name: "Six of Hearts",   shortName: "6♥" },
    { code: "7h", suit: Suit.HEARTS, rank: Rank.SEVEN, value: 7,  name: "Seven of Hearts", shortName: "7♥" },
    { code: "8h", suit: Suit.HEARTS, rank: Rank.EIGHT, value: 8,  name: "Eight of Hearts", shortName: "8♥" },
    { code: "9h", suit: Suit.HEARTS, rank: Rank.NINE,  value: 9,  name: "Nine of Hearts",  shortName: "9♥" },
    { code: "Th", suit: Suit.HEARTS, rank: Rank.TEN,   value: 10, name: "Ten of Hearts",   shortName: "T♥" },
    { code: "Jh", suit: Suit.HEARTS, rank: Rank.JACK,  value: 10, name: "Jack of Hearts",  shortName: "J♥" },
    { code: "Qh", suit: Suit.HEARTS, rank: Rank.QUEEN, value: 10, name: "Queen of Hearts", shortName: "Q♥" },
    { code: "Kh", suit: Suit.HEARTS, rank: Rank.KING,  value: 10, name: "King of Hearts",  shortName: "K♥" },
    { code: "Ah", suit: Suit.HEARTS, rank: Rank.ACE,   value: 11, name: "Ace of Hearts",   shortName: "A♥" },

    // CLUBS
    { code: "2c", suit: Suit.CLUBS, rank: Rank.TWO,   value: 2,  name: "Two of Clubs",   shortName: "2♣" },
    { code: "3c", suit: Suit.CLUBS, rank: Rank.THREE, value: 3,  name: "Three of Clubs", shortName: "3♣" },
    { code: "4c", suit: Suit.CLUBS, rank: Rank.FOUR,  value: 4,  name: "Four of Clubs",  shortName: "4♣" },
    { code: "5c", suit: Suit.CLUBS, rank: Rank.FIVE,  value: 5,  name: "Five of Clubs",  shortName: "5♣" },
    { code: "6c", suit: Suit.CLUBS, rank: Rank.SIX,   value: 6,  name: "Six of Clubs",   shortName: "6♣" },
    { code: "7c", suit: Suit.CLUBS, rank: Rank.SEVEN, value: 7,  name: "Seven of Clubs", shortName: "7♣" },
    { code: "8c", suit: Suit.CLUBS, rank: Rank.EIGHT, value: 8,  name: "Eight of Clubs", shortName: "8♣" },
    { code: "9c", suit: Suit.CLUBS, rank: Rank.NINE,  value: 9,  name: "Nine of Clubs",  shortName: "9♣" },
    { code: "Tc", suit: Suit.CLUBS, rank: Rank.TEN,   value: 10, name: "Ten of Clubs",   shortName: "T♣" },
    { code: "Jc", suit: Suit.CLUBS, rank: Rank.JACK,  value: 10, name: "Jack of Clubs",  shortName: "J♣" },
    { code: "Qc", suit: Suit.CLUBS, rank: Rank.QUEEN, value: 10, name: "Queen of Clubs", shortName: "Q♣" },
    { code: "Kc", suit: Suit.CLUBS, rank: Rank.KING,  value: 10, name: "King of Clubs",  shortName: "K♣" },
    { code: "Ac", suit: Suit.CLUBS, rank: Rank.ACE,   value: 11, name: "Ace of Clubs",   shortName: "A♣" },

    // SPADES
    { code: "2s", suit: Suit.SPADES, rank: Rank.TWO,   value: 2,  name: "Two of Spades",   shortName: "2♠" },
    { code: "3s", suit: Suit.SPADES, rank: Rank.THREE, value: 3,  name: "Three of Spades", shortName: "3♠" },
    { code: "4s", suit: Suit.SPADES, rank: Rank.FOUR,  value: 4,  name: "Four of Spades",  shortName: "4♠" },
    { code: "5s", suit: Suit.SPADES, rank: Rank.FIVE,  value: 5,  name: "Five of Spades",  shortName: "5♠" },
    { code: "6s", suit: Suit.SPADES, rank: Rank.SIX,   value: 6,  name: "Six of Spades",   shortName: "6♠" },
    { code: "7s", suit: Suit.SPADES, rank: Rank.SEVEN, value: 7,  name: "Seven of Spades", shortName: "7♠" },
    { code: "8s", suit: Suit.SPADES, rank: Rank.EIGHT, value: 8,  name: "Eight of Spades", shortName: "8♠" },
    { code: "9s", suit: Suit.SPADES, rank: Rank.NINE,  value: 9,  name: "Nine of Spades",  shortName: "9♠" },
    { code: "Ts", suit: Suit.SPADES, rank: Rank.TEN,   value: 10, name: "Ten of Spades",   shortName: "T♠" },
    { code: "Js", suit: Suit.SPADES, rank: Rank.JACK,  value: 10, name: "Jack of Spades",  shortName: "J♠" },
    { code: "Qs", suit: Suit.SPADES, rank: Rank.QUEEN, value: 10, name: "Queen of Spades", shortName: "Q♠" },
    { code: "Ks", suit: Suit.SPADES, rank: Rank.KING,  value: 10, name: "King of Spades",  shortName: "K♠" },
    { code: "As", suit: Suit.SPADES, rank: Rank.ACE,   value: 11, name: "Ace of Spades",   shortName: "A♠" },
];

const cardMap = new Map<string, Card>();
cardList.forEach(c => {
    cardMap.set(c.code, c);
});

/**
 * Returns a random card from the cardList.
 * @returns {Card} A random card object.
 */
const getRandomCard = (): Card => {
    const randomIndex: number = Math.floor(Math.random() * cardList.length);
    return cardList[randomIndex]!;
}

const getRandomFlop = (): Card[] => {
    const shuffledCards = [...cardList].sort(() => Math.random() - 0.5);
    return shuffledCards.slice(0, 3);
}

export {cardMap, cardList, getRandomCard, getRandomFlop};