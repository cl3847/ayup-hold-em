import type {DAOs} from "../models/DAOs.ts";
import type {Pool} from "pg";
import type {User} from "../models/user/User.ts";
import {config} from "../../config.ts";

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
}

export default UserService;