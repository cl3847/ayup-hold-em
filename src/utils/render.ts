import {createCanvas, loadImage} from 'canvas';
import type {Card} from "../types/CardType.ts";
import * as fs from "node:fs";

export async function renderBoard(cards: Card[]): Promise<Buffer> {
    const OFFSET_FIRST_CARD_X = 235; // X offset for the first card
    const OFFSET_CARDS_Y = 480; // Y offset for the first card
    const OFFSET_BETWEEN_CARDS_X = 150; // X offset for each subsequent card
    const CARD_WIDTH = 119; // Width of each card
    const CARD_HEIGHT = 191; // Height of each card

    // Create a canvas with width 400 and height 200
    const canvas = createCanvas(1200, 810);
    const ctx = canvas.getContext('2d');

    try {
        // Load the background image
        const backgroundImage = await loadImage("assets/table.png");
        ctx.drawImage(backgroundImage, 0, 0);

        const cardImagePromises = cards
            .slice(0, 5) // Take the first 5 cards
            .map(card => {
                const cardPath = `assets/cards/${card.code}.png`;
                const imageToLoad = fs.existsSync(cardPath) ? cardPath : "assets/cards/default.png";
                return loadImage(imageToLoad);
            });
        // Wait for all card images to load concurrently then load them
        const loadedCardImages = await Promise.all(cardImagePromises);
        loadedCardImages.forEach((image, index) => {
            ctx.drawImage(image, index * OFFSET_BETWEEN_CARDS_X + OFFSET_FIRST_CARD_X, OFFSET_CARDS_Y, CARD_WIDTH, CARD_HEIGHT); // Draw each card image at the specified position
        });

        // Return the canvas as a buffer
        return canvas.toBuffer();
    } catch (error) {
        console.error("Error rendering board:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
}