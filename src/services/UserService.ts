import type {DAOs} from "../models/DAOs.ts";
import type {Pool} from "pg";
import type {User} from "../models/user/User.ts";
import {config} from "../../config.ts";
import type UserHand from "../models/user/UserHand.ts";
import type {GameState} from "../models/GameState.ts";
import type {UserBoard} from "../models/user/UserBoard.ts";
import log from "../utils/logger.ts";
import {drawRandomNCards} from "../utils/cards.ts";

class UserService {
    private daos: DAOs;
    private pool: Pool;

    constructor(daos: DAOs, pool: Pool) {
        this.daos = daos;
        this.pool = pool;
    }

    public async initUser(uid: string): Promise<void> {
        const pc = await this.pool.connect();
        try {
            await pc.query("BEGIN");
            const newUser: User = {
                uid,
                balance: config.game.startingBalance,
            };
            await this.daos.users.createUser(pc, newUser);

            // Initialize the user's board for the current day with random hole cards
            const randomHoleCards = drawRandomNCards(2);
            const newUserBoard: UserBoard = {
                uid,
                day: 1, // Start on day 1
                hole1: randomHoleCards[0]!.code, // Placeholder, will be set when the user draws their cards
                hole2: randomHoleCards[1]!.code, // Placeholder, will be set when the user draws their cards
                tarot1: null, // No tarot card drawn initially
                tarot2: null, // No tarot card drawn initially
            }
            await this.daos.users.createUserBoard(pc, newUserBoard);

            await pc.query("COMMIT");
        } catch (err) {
            await pc.query('ROLLBACK');
            throw err; // Re-throw to be handled by the caller
        } finally {
            pc.release();
        }
    }

    public async getUser(uid: string): Promise<User | null> {
        const pc = await this.pool.connect();
        const res = await this.daos.users.getUser(pc, uid);
        pc.release();
        return res;
    }

    public async getAllUsers(): Promise<User[]> {
        const pc = await this.pool.connect();
        const res = await this.daos.users.getAllUsers(pc);
        pc.release();
        return res;
    }

    public async createUser(user: User): Promise<void> {
        const pc = await this.pool.connect();
        const res = await this.daos.users.createUser(pc, user);
        pc.release();
        return res;
    }

    public async updateUser(uid: string, user: Partial<User>): Promise<void>{
        const pc = await this.pool.connect();
        const res = await this.daos.users.updateUser(pc, uid, user);
        pc.release();
        return res;
    }

    public async getUserHandOnDay(uid: string, day: number): Promise<UserHand | null> {
        const pc = await this.pool.connect();
        const res = await this.daos.users.getUserHandOnDay(pc, uid, day);
        pc.release();
        return res;
    }

    public async getUserHandToday(uid: string): Promise<UserHand | null> {
        const pc = await this.pool.connect();
        const gameState =  await this.daos.objects.getObject(pc, "gameState") as GameState;

        const res = await this.daos.users.getUserHandOnDay(pc, uid, gameState.day);
        pc.release();
        return res;
    }

    public async createUserBoard(userBoard: UserBoard): Promise<void> {
        const pc = await this.pool.connect();
        const res = await this.daos.users.createUserBoard(pc, userBoard);
        pc.release();
        return res;
    }

    /**
     * Swaps the hole cards of two users at the specified indices.
     * NOTE: Does NOT validate that the users have the cards they want to swap.
     *       Ensure that the users have the specified cards right before calling this method to avoid race conditions.
     *       Ensure that both users have drawn their cards for today before calling this method.
     * @param uid1 The UID of the first user
     * @param uid2 The UID of the second user
     * @param u1cardIndex 1 | 2 The index of the card to swap for the first user (1 or 2)
     * @param u2cardIndex 1 | 2 The index of the card to swap for the second user (1 or 2)
     */
    public async swapUserHoleCards(uid1: string, uid2: string, u1cardIndex: 1 | 2, u2cardIndex: 1 | 2): Promise<void> {
        const pc = await this.pool.connect();
        try {
            await pc.query("BEGIN");
            // Get the current user boards
            const userHand1 = await this.getUserHandToday(uid1);
            const userHand2 = await this.getUserHandToday(uid2);

            if (!userHand1 || !userHand2) {
                throw new Error("One or both users do not have a hand drawn for today.");
            }

            // Swap the cards
            const card1 = u1cardIndex === 1 ? userHand1.hole1 : userHand1.hole2;
            const card2 = u2cardIndex === 1 ? userHand2.hole1 : userHand2.hole2;

            const newUserBoard1 = userHand1.toUserBoard();
            const newUserBoard2 = userHand2.toUserBoard();
            // Update the hole cards in the user boards
            if (u1cardIndex === 1) {
                newUserBoard1.hole1 = card2.code;
            } else {
                newUserBoard1.hole2 = card2.code;
            }

            if (u2cardIndex === 1) {
                newUserBoard2.hole1 = card1.code;
            } else {
                newUserBoard2.hole2 = card1.code;
            }

            // Update the user boards in the database
            await this.daos.users.updateUserBoard(pc, newUserBoard1);
            await this.daos.users.updateUserBoard(pc, newUserBoard2);

            await pc.query("COMMIT");
        } catch (err: any) {
            await pc.query('ROLLBACK');
            log.error(`Failed to swap hole cards between ${uid1} and ${uid2}: ${err.message}`);
            throw err; // Re-throw to be handled by the caller
        } finally {
            pc.release();
        }
    }
}

export default UserService;