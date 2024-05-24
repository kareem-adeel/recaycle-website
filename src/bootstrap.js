import { connection } from "../DB/connection.js";
import categoryRouter from "./modules/category/category.router.js";
import authRouter from "./modules/auth/auth.router.js";
import productRouter from "./modules/product/product.router.js"
import orderRouter from "./modules/Order/order.router.js"
import cartRouter from "./modules/cart/cart.router.js"
import userRouter from "./modules/User/user.router.js"
import { globalError } from "./utils/errorHandling.js";

function bootstrap(app, express) {
  //Convert Buffer Data
  app.use((req,res,next)=>{
    if(req.originalUrl=="/order/webhook"){
      return next();
    }
  else{

    express.json()(req,res,next);
  }
    
  });
  app.use("/category", categoryRouter);
  
  
  app.use("/auth", authRouter);
  app.use('/user', userRouter)
  app.use("/product", productRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  

  connection();

  app.use(globalError);
}

export default bootstrap;
