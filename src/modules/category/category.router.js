import {Router} from 'express'
import uploadFileCloud, { filevalidtion } from '../../utils/multer.js'
import * as categoryController from "./controller/category.controller.js"
import * as categoryValidation from "./category.validation.js"
import validation from '../../middleware/validation.js'
import auth from '../../middleware/auth.js'
import categoryEndPoints from './category.endPoints.js'
const router=Router()

//Create Category 
router
    .post(
        "/add",
    validation(categoryValidation.tokenSchema,true),
    auth(categoryEndPoints.create),
    uploadFileCloud({customValidtion:filevalidtion.Image}).single('Image'),
    validation(categoryValidation.createCategorySchema),
    categoryController.createCategory
    )
    .get(
        "/",
        categoryController.getAllCategories
    )
    .get(
        "/:categoryId",
        validation(categoryValidation.getCategorySchema),
        categoryController.getOneCategory
    )
    .put(
        "/:categoryId",
        validation(categoryValidation.tokenSchema,true),
        auth(categoryEndPoints.update),
        uploadFileCloud({customValidtion:filevalidtion.Image}).single('Image'),
        validation(categoryValidation.updateCategorySchema),
        categoryController.updateCategory
    )
    .delete(
        "/:categoryId",
        validation(categoryValidation.tokenSchema,true),
        auth(categoryEndPoints.delete),
        categoryController.deleteCategory
        )



export default router