import { roles } from "../../middleware/auth.js";

const orderEndPoints={
    create:[roles.User],
    cancel:[roles.User],
    deliver:[roles.Admin],
    
}

export default orderEndPoints