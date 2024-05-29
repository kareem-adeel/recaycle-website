import { roles } from "../../middleware/auth.js";

export const userEndPoints={
    
    delete:[roles.Admin]
}