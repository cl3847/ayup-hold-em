import UserDAO from "../handlers/UserDAO";
import type ObjectDAO from "../handlers/ObjectDAO.ts";
import type BoardDAO from "../handlers/BoardDAO.ts";

export interface DAOs {
    users: UserDAO;
    boards: BoardDAO;
    objects: ObjectDAO;
}
