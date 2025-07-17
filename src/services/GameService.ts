import {Pool} from "pg";
import type {DAOs} from "../models/DAOs.ts";
import type {GameState} from "../models/GameState.ts";

class GameService {
    private daos: DAOs;
    private pool: Pool;

    constructor(daos: DAOs, pool: Pool) {
        this.daos = daos;
        this.pool = pool;
    }

    public async getGameState(): Promise<GameState> {
        const pc = await this.pool.connect();
        const res = await this.daos.objects.getObject(pc, "gameState");
        pc.release();
        return res as GameState;
    }

    public async createGameState(gameState: GameState) {
        const pc = await this.pool.connect();
        const res = await this.daos.objects.createObject(pc, "gameState", gameState);
        pc.release();
        return res;
    }

    public async updateGameState(gameState: GameState) {
        const pc = await this.pool.connect();
        const res = await this.daos.objects.updateObject(pc, "gameState", gameState);
        pc.release();
        return res;
    }
}

export default GameService;