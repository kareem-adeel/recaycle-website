import slugify from "slugify";
import categoryModel from "../../../../DB/models/Category.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { nanoid } from "nanoid";
import productModel from "../../../../DB/models/Product.model.js";
import cloudinary from "../../../utils/cloudinary.js";






//Create Product
export const createProduct=asyncHandler(
    async(req,res,next)=>{
        //1-get categoryId
        const {categoryId,point}=req.body
        if (!await categoryModel.findById({_id:categoryId})) {
            return next(new Error("Category Not Found",{cause:404}))
            
          }

        

        
        //2-create slug
        req.body.slug=slugify(req.body.name,{
            lower:true,
            trim:true
        })

        //3-calculte final point -->point-((point*discount)/100)
        req.body.finalPoint=point

        //4-create customId
        req.body.customId=nanoid()
        

        //5-upload mainImage
        const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.files.mainImage[0].path,
            { folder: `${process.env.APP_NAME}/Prouct/${req.body.customId}/mainImage` }
          );
          if (!secure_url) {
            return next(new Error("Iamge Not Found", { cause: 400 }));
          }
          req.body.mainImage = { secure_url, public_id };
          
          //6-check sub image
          
          if(req.files?.subImages){
            req.body.subImages=[]
            for (const file of req.files.subImages) {
          
              const { secure_url, public_id } = await cloudinary.uploader.upload(
                file.path,
                { folder: `${process.env.APP_NAME}/Prouct/${req.body.customId}/subImage` }
              );
              
              if (!secure_url) {
                return next(new Error("Iamge Not Found", { cause: 400 }));
              }
              req.body.subImages.push({ secure_url, public_id })
            }
            
          }

          //7-add created by
          req.body.createdBy=req.user._id
          
          //8-Create product
          const product=await productModel.create(req.body)
          return res.status(201).json({message:"Done",product})
    }
)

//Update Product
export const updateProduct=asyncHandler(
  async(req,res,next)=>{

      //productId  
      const product=await productModel.findById({_id:req.params.productId})
      if(!product){
        return next(new Error("product not Found",{cause:404}))
      } 
    //CategoryId-->if exist

    if (!await categoryModel.findById({_id:req.body.categoryId})) {
      return next(new Error("Category Not Found",{cause:404}))
      
    }



      
 
      //name-->slug
        if (req.body.name){
          req.body.slug=slugify(req.body.name,{
            lower:true,
            trim:true
        })
        }

      //Update final point
      req.body.finalPoint= req.body.point

      

      //Check mainImage
      if(req.files?.mainImage?.length){
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          req.files.mainImage[0].path,
          { folder: `${process.env.APP_NAME}/Prouct/${product.customId}/mainImage` }
        );
        if (!secure_url) {
          return next(new Error("Iamge Not Found", { cause: 400 }));
        }
        await cloudinary.uploader.destroy(product.mainImage.public_id)
        req.body.mainImage = { secure_url, public_id };

      }
      
        
       

      //Check subImages
        if(req.files?.subImages){
          req.body.subImages=[]
          for (const file of req.files.subImages) {
        
            const { secure_url, public_id } = await cloudinary.uploader.upload(
              file.path,
              { folder: `${process.env.APP_NAME}/Prouct/${product.customId}/subImage` }
            );
            
            if (!secure_url) {
              return next(new Error("Iamge Not Found", { cause: 400 }));
            }
            product.subImages.push({ secure_url, public_id })
          }
          req.body.subImages=product.subImages
          
        }

        //add updatedBy
        req.body.updatedBy=req.user._id
        
        //Update Product
        const update=await productModel.findByIdAndUpdate({_id:req.params.productId},req.body,{new:true})
        return res.status(200).json({message:"Done",update})
  }
)

//Get Products
export const getProducts=asyncHandler(
  async(req,res,next)=>{
    const products=await productModel.find({})
    return res.status(200).json({message:"Done",products})
  }
)

//Get OneProduct
export const getOneProducts=asyncHandler(
  async(req,res,next)=>{
    const {productId}=req.params
    const product=await productModel.findById({_id:productId})
    return res.status(200).json({message:"Done",product})
  }
)


//delete product
export const deleteProduct=asyncHandler(
  async (req,res,next)=>{
      
      const {productId}=req.params
      const product=await productModel.findOne({_id:productId})
      if(!product){
          return next(new Error("product Not Found",{cause:404}));
      }


      const deleteProduct = await productModel.findOneAndDelete({_id:productId})
      return res.status(200).json({message:"Done"})

  }
)

