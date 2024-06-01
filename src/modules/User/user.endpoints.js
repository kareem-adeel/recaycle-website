import { roles } from "../../middleware/auth.js";

export const userEndPoints={
    change:[roles.User],
    delete:[roles.Admin]
}