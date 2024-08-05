import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";
import { AddItemToCart, changeQuantity, deleteItemFromCart, getCart } from "../controllers/cart";



const cartRoutes:Router = Router()


cartRoutes.post('/', [authMiddleware] , errorHandler(AddItemToCart))
cartRoutes.delete('/:id', [authMiddleware] , errorHandler(deleteItemFromCart))
cartRoutes.put('/:id', [authMiddleware] , errorHandler(changeQuantity))
cartRoutes.get('/', [authMiddleware] , errorHandler(getCart))

export default cartRoutes