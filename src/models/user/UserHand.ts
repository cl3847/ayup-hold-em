import type {User} from "./User.ts";
import type {Board} from "../board/Board.ts";
import type {UserBoard} from "./UserBoard.ts";

/**
 * A class containing all the information in a User, their hand, and the community cards for a specific day.
 */
class UserHand implements User, UserBoard, Board {
    uid!: string;
    balance!: number;

    hole1!: string;
    hole2!: string;

    day!: number;
    flop1!: string;
    flop2!: string;
    flop3!: string;
    turn!: string;
    river!: string;

    constructor(user: User, userBoard: UserBoard, board: Board) {
        Object.assign(this, user, userBoard, board);
    }
}

export default UserHand;
