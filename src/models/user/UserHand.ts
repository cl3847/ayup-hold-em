import type {User} from "./User.ts";
import type {Board} from "../board/Board.ts";
import type {UserBoard} from "./UserBoard.ts";
import type {Card} from "../../types/CardType.ts";
import {cardMap} from "../../utils/cards.ts";
import Service from "../../services/Service.ts";
import {MajorArcana, type Tarot} from "../../types/TarotType.ts";
import {tarotMap} from "../../utils/tarots.ts";

/**
 * A class containing all the information in a User, their hand, and the community cards for a specific day.
 */
class UserHand implements User {
    uid!: string;
    balance!: number;

    hole1!: Card;
    hole2!: Card;
    tarot1: Tarot | null;
    tarot2: Tarot | null;
    tarot3: Tarot | null;

    day!: number;
    flop1!: Card;
    flop2!: Card;
    flop3!: Card;
    turn!: Card;
    river!: Card;

    tarotCollection: Tarot[];

    constructor(user: User, userBoard: UserBoard, board: Board, tarotCollection: MajorArcana[] = []) {
        Object.assign(this, user);
        this.day = userBoard.day;

        this.hole1 = cardMap.get(userBoard.hole1)!;
        this.hole2 = cardMap.get(userBoard.hole2)!;
        this.tarot1 = userBoard.tarot1 ? tarotMap.get(userBoard.tarot1)! : null;
        this.tarot2 = userBoard.tarot2 ? tarotMap.get(userBoard.tarot2)! : null;
        this.tarot3 = userBoard.tarot3 ? tarotMap.get(userBoard.tarot3)! : null;

        this.flop1 = cardMap.get(board.flop1)!;
        this.flop2 = cardMap.get(board.flop2)!;
        this.flop3 = cardMap.get(board.flop3)!;
        this.turn = cardMap.get(board.turn)!;
        this.river = cardMap.get(board.river)!;

        this.tarotCollection = tarotCollection.map(tarot => tarotMap.get(tarot)!);
    }

    public toUserBoard(): UserBoard {
        return {
            uid: this.uid,
            day: this.day,
            hole1: this.hole1.code,
            hole2: this.hole2.code,
            tarot1: this.tarot1 ? this.tarot1.code : null,
            tarot2: this.tarot2 ? this.tarot2.code : null,
            tarot3: this.tarot3 ? this.tarot3.code : null,
        };
    }

    /**
     * Returns the user's hole cards as an array.
     * @returns {Card[]} An array containing the user's hole cards.
     */
    public getHoleCards(): Card[] {
        return [this.hole1, this.hole2];
    }

    /**
     * Returns the community cards as an array.
     * @returns {Card[]} An array containing the community cards (flop1, flop2, flop3, turn, river).
     */
    public getCommunityCards(): Card[] {
        return [this.flop1, this.flop2, this.flop3, this.turn, this.river];
    }

    /**
     * Returns the showable community cards based on the current game phase.
     */
    public async getShowableCommunityCards(): Promise<Card[]> {
        const gameState = await Service.getInstance().game.getGameState();
        const showableCommunityCardLength = gameState.phase === 1 ? 3 : gameState.phase === 2 ? 4 : 5;
        return this.getCommunityCards().slice(0, showableCommunityCardLength);
    }

    /**
     * Returns the active tarot cards in the user's hand.
     * @returns {Tarot[]} An array containing the active tarot cards (tarot1, tarot2, tarot3).
     * If a tarot card is not set, it will not be included in the array.
     */
    public getActiveTarots(): Tarot[] {
        const activeTarots: Tarot[] = [];
        if (this.tarot1) activeTarots.push(this.tarot1);
        if (this.tarot2) activeTarots.push(this.tarot2);
        if (this.tarot3) activeTarots.push(this.tarot3);
        return activeTarots;
    }
}

export default UserHand;
