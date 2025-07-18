import type { Board } from "../models/board/Board.ts";
import type { PoolClient } from "pg";

class BoardDAO {
    /**
     * Writes a Board object to the database for a specific day.
     * @param pc {PoolClient} A Postgres Client
     * @param {Board} board The board data for a given day.
     * @returns {Promise<void>} A promise resolving to nothing.
     */
    public async createBoard(pc: PoolClient, board: Board): Promise<void> {
        const keyString = Object.keys(board).join(", ");
        const valueString = Object.keys(board).map((_, index) => `$${index + 1}`).join(", ");
        const query = `INSERT INTO boards (${keyString})
                       VALUES (${valueString})`;
        const params = Object.values(board);
        await pc.query(query, params);
    }

    /**
     * Gets a board corresponding to a specific day.
     * @param pc {PoolClient} A Postgres Client
     * @param {number} day The day of the board to get.
     * @returns {Promise<Board | null>} A promise resolving to a Board if one for that day exists, otherwise null.
     */
    public async getBoard(pc: PoolClient, day: number): Promise<Board | null> {
        const query = "SELECT * FROM boards WHERE day = $1";
        const params = [day];
        const result = await pc.query(query, params);
        return result.rows[0] || null;
    }

    /**
     * Updates a board corresponding to a specific day.
     * @param pc {PoolClient} A Postgres Client
     * @param {number} day The day of the board to update.
     * @param {Partial<Board>} board The fields to update in the board.
     * @returns {Promise<void>} A promise resolving to nothing.
     */
    public async updateBoard(pc: PoolClient, day: number, board: Partial<Board>): Promise<void> {
        const fields = Object.keys(board).map((key, index) => `${key} = $${index + 1}`).join(", ");
        const query = `UPDATE boards
                       SET ${fields}
                       WHERE day = $${Object.keys(board).length + 1}`;
        const params = [...Object.values(board), day];
        await pc.query(query, params);
    }


    /**
     * Deletes a board corresponding to a specific day.
     * @param pc {PoolClient} A Postgres Client
     * @param {number} day The day of the board to delete.
     * @returns {Promise<void>} A promise resolving to nothing.
     */
    public async deleteBoard(pc: PoolClient, day: number): Promise<void> {
        const query = "DELETE FROM boards WHERE day = $1";
        const params = [day];
        await pc.query(query, params);
    }
}

export default BoardDAO;