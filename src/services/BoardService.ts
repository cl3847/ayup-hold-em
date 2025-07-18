import type {DAOs} from "../models/DAOs.ts";
import type {Pool} from "pg";
import type {Board} from "../models/board/Board.ts";
import {getRandomHand} from "../utils/cards.ts";
import type {GameState} from "../models/GameState.ts";
import logger from "../utils/logger.ts";

class BoardService {
    private daos: DAOs;
    private pool: Pool;

    constructor(daos: DAOs, pool: Pool) {
        this.daos = daos;
        this.pool = pool;
    }

    public async getBoard(day: number): Promise<Board | null> {
        const pc = await this.pool.connect();
        const res = await this.daos.boards.getBoard(pc, day);
        pc.release();
        return res;
    }

    public async createBoard(board: Board): Promise<void> {
        const pc = await this.pool.connect();
        const res = await this.daos.boards.createBoard(pc, board);
        pc.release();
        return res;
    }

    public async createBoardIncrementDay(): Promise<Board> {
        const pc = await this.pool.connect();
        const communityCards = getRandomHand();

        try {
            await pc.query("BEGIN");
            const gameState =  await this.daos.objects.getObject(pc, "gameState") as GameState;

            // increment the day and create a new board
            gameState.day += 1;
            const newBoard: Board = {
                day: gameState.day,
                flop1: communityCards[0]!.code,
                flop2: communityCards[1]!.code,
                flop3: communityCards[2]!.code,
                turn: communityCards[3]!.code,
                river: communityCards[4]!.code,
            }

            // save the new board and update the game state with the new day number
            await this.daos.boards.createBoard(pc, newBoard);
            await this.daos.objects.updateObject(pc, "gameState", gameState);
            await pc.query("COMMIT");

            logger.success(`Created new board for day ${gameState.day}: ${communityCards.map(card => card.shortName).join(' | ')}`);
            return newBoard;
        } catch (err) {
            await pc.query('ROLLBACK');
            throw err; // Re-throw to be handled by the caller
        } finally {
            pc.release();
        }
    }
}

export default BoardService;