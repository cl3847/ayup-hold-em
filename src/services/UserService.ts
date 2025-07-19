import type {DAOs} from "../models/DAOs.ts";
import type {Pool} from "pg";
import type {User} from "../models/user/User.ts";
import {config} from "../../config.ts";
import type UserHand from "../models/user/UserHand.ts";
import type {GameState} from "../models/GameState.ts";
import type {UserBoard} from "../models/user/UserBoard.ts";

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
}

export default UserService;