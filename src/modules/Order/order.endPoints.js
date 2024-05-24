import { roles } from "../../middleware/auth.js";

const orderEndPoints={
    create:[roles.User],
    cancel:[roles.User],
    deliver:[roles.Admin] //change to Admin
}

export default orderEndPoints