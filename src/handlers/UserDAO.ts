import type {User} from "../models/user/User.ts";
import type {PoolClient} from "pg";
import UserHand from "../models/user/UserHand.ts";
import type {UserBoard} from "../models/user/UserBoard.ts";
import type {Board} from "../models/board/Board.ts";

class UserDAO {
    /**
     * Writes a User object to the database
     * @param pc {PoolClient} A Postgres Client
     * @param {User} user The user for which to write to the database
     * @returns {Promise<void>} A promise resolving to nothing
     */
    public async createUser(pc: PoolClient, user: User): Promise<void> {
        const keyString = Object.keys(user).join(", ");
        const valueString = Object.keys(user).map((_, index) => `$${index + 1}`).join(", ");
        const query = `INSERT INTO users (${keyString})
                       VALUES (${valueString})`;
        const params = Object.values(user);
        await pc.query(query, params);
    }

    /**
     * Gets a user corresponding to a specific UID
     * @param pc {PoolClient} A Postgres Client
     * @param {string} uid The UID of the user for which to get
     * @returns {Promise<User | null>} A promise resolving to a User if a user with the UID exists, otherwise null
     */
    public async getUser(pc: PoolClient, uid: string): Promise<User | null> {
        const query = "SELECT * FROM users WHERE uid = $1";
        const params = [uid];
        const result = await pc.query(query, params);
        return result.rows[0] || null;
    }

    /**
     * Updates a user corresponding to a specific UID
     * @param pc {PoolClient} A Postgres Client
     * @param {string} uid The UID of the user for which to update
     * @param {Partial<User>} user The fields to update in the user
     * @returns {Promise<void>} A promise resolving to nothing
     */
    public async updateUser(pc: PoolClient, uid: string, user: Partial<User>): Promise<void> {
        const fields = Object.keys(user).map((key, index) => `${key} = $${index + 1}`).join(", ");
        const query = `UPDATE users
                       SET ${fields}
                       WHERE uid = $${Object.keys(user).length + 1}`;
        const params = [...Object.values(user), uid];
        await pc.query(query, params);
    }


    /**
     * Deletes a user corresponding to a specific UID
     * @param pc {PoolClient} A Postgres Client
     * @param {string} uid The UID of the user for which to delete
     * @returns {Promise<void>} A promise resolving to nothing
     */
    public async deleteUser(pc: PoolClient, uid: string): Promise<void> {
        const query = "DELETE FROM users WHERE uid = $1";
        const params = [uid];
        await pc.query(query, params);
    }

    public async getUserHandOnDay(pc: PoolClient, uid: string, day: number): Promise<UserHand | null> {
        const query = "SELECT row_to_json(u.*) as profile, row_to_json(ub.*) as userboard, row_to_json(b.*) as board FROM users as u NATURAL JOIN users_boards as ub NATURAL JOIN boards as b WHERE uid = $1 AND day = $2";
        const params = [uid, day];
        const result = await pc.query(query, params);
        if (result.rowCount === 0) return null; // No user hand found for the given UID and day
        return new UserHand(result.rows[0].profile as User, result.rows[0].userboard as UserBoard, result.rows[0].board as Board) || null;
    }

    public async createUserBoard(pc: PoolClient, userBoard: UserBoard): Promise<void> {
        const keyString = Object.keys(userBoard).join(", ");
        const valueString = Object.keys(userBoard).map((_, index) => `$${index + 1}`).join(", ");
        const query = `INSERT INTO users_boards (${keyString})
                       VALUES (${valueString})`;
        const params = Object.values(userBoard);
        await pc.query(query, params);
    }
}

export default UserDAO;