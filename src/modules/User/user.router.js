import {Router} from 'express'
import * as userController from "./controller/user.controller.js"
import * as uservalidtion from "./user.validation.js"
import * as userEndPoints from "./user.endpoints.js"
import auth from '../../middleware/auth.js'
import validation from '../../middleware/validation.js'
const router=Router()

router
    
    .delete(
        "/:userId",
        validation(uservalidtion.tokenSchema,true),
        auth(userEndPoints.delete),
        userController.deleteUser
        )




export default router