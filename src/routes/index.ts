import { Router } from "express";
import authRouter from "./auth";
import productRoutes from "./products";
import userRoutes from "./users";
import cartRoutes from "./carts";
import orderRoutes from "./order";

const rootRouter:Router = Router()

rootRouter.use('/auth', authRouter)
rootRouter.use('/products', productRoutes)
rootRouter.use('/users', userRoutes)
rootRouter.use('/carts', cartRoutes)
rootRouter.use('/orders', orderRoutes)

export default rootRouter