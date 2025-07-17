import UserDAO from "../handlers/UserDAO";
import type ObjectDAO from "../handlers/ObjectDAO.ts";

export interface DAOs {
    users: UserDAO;
    objects: ObjectDAO;
}
