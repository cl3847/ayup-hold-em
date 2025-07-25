import type {DAOs} from "../models/DAOs.ts";
import type {Pool} from "pg";
import type {User} from "../models/user/User.ts";
import {config} from "../../config.ts";
import type UserHand from "../models/user/UserHand.ts";
import type {GameState} from "../models/GameState.ts";
import type {UserBoard} from "../models/user/UserBoard.ts";
import log from "../utils/logger.ts";

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
            // TODO: Initialize the user's cards and items if necessary
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
            const userBoard1 = await this.getUserHandToday(uid1);
            const userBoard2 = await this.getUserHandToday(uid2);

            if (!userBoard1 || !userBoard2) {
                throw new Error("One or both users do not have a hand drawn for today.");
            }

            // Swap the cards
            const card1 = u1cardIndex === 1 ? userBoard1.hole1 : userBoard1.hole2;
            const card2 = u2cardIndex === 1 ? userBoard2.hole1 : userBoard2.hole2;

            const newUserBoard1: UserBoard = {
                uid: uid1,
                day: userBoard1.day,
                hole1: u1cardIndex === 1 ? card2.code : userBoard1.hole1.code,
                hole2: u1cardIndex === 2 ? card2.code : userBoard1.hole2.code,
            };
            const newUserBoard2: UserBoard = {
                uid: uid2,
                day: userBoard2.day,
                hole1: u2cardIndex === 1 ? card1.code : userBoard2.hole1.code,
                hole2: u2cardIndex === 2 ? card1.code : userBoard2.hole2.code,
            };

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