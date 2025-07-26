/**
 * Represents the relationship of a user owning a given tarot card.
 * This is used to track which tarot cards a user has in their collection.
 */
export interface UserTarot {
    uid: string; // User ID
    tarot: string; // Tarot card code
}