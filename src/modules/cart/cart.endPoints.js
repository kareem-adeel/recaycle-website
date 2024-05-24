import { roles } from "../../middleware/auth.js"

const cartEndPoints={
    addToCart:[roles.User],
    update:[roles.User],
    clear:[roles.User]
    
}

export default cartEndPoints