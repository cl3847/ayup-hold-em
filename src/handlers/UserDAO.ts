import type {User} from "../models/user/User.ts";
import type {PoolClient} from "pg";

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
}

export default UserDAO;