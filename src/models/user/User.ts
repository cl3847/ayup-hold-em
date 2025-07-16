export interface User {
    uid: string;
    balance: number;
    hole1?: string | null; // Card code for the first hole card
    hole2?: string | null; // Card code for the second hole card
}
