import type {User} from "./User.ts";
import type {Board} from "../board/Board.ts";
import type {UserBoard} from "./UserBoard.ts";
import type {Card} from "../../types/CardType.ts";
import {cardMap} from "../../utils/cards.ts";

/**
 * A class containing all the information in a User, their hand, and the community cards for a specific day.
 */
class UserHand implements User {
    uid!: string;
    balance!: number;

    hole1!: Card;
    hole2!: Card;

    day!: number;
    flop1!: Card;
    flop2!: Card;
    flop3!: Card;
    turn!: Card;
    river!: Card;

    constructor(user: User, userBoard: UserBoard, board: Board) {
        Object.assign(this, user);
        this.day = userBoard.day;

        this.hole1 = cardMap.get(userBoard.hole1)!;
        this.hole2 = cardMap.get(userBoard.hole2)!;

        this.flop1 = cardMap.get(board.flop1)!;
        this.flop2 = cardMap.get(board.flop2)!;
        this.flop3 = cardMap.get(board.flop3)!;
        this.turn = cardMap.get(board.turn)!;
        this.river = cardMap.get(board.river)!;
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
}

export default UserHand;
