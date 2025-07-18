/**
 * Represents the board in a poker game for a specific day.
 */
export interface Board {
    day: number;
    flop1: string;
    flop2: string;
    flop3: string;
    turn: string;
    river: string;
}