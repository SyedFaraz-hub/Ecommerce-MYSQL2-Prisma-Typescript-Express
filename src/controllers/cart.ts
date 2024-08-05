import { Request, Response } from "express"
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";
import { Product } from "@prisma/client";


export const AddItemToCart = async (req: Request, res: Response) => {
    const validatedData = CreateCartSchema.parse(req.body);
    let product: Product

    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productID
            }
        })


    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND);
    }

    const user = req.user as any

    const cart = await prismaClient.cartItem.create({
        data: {
            userID:  user.id,
            productID: product.id,
            quantity: validatedData.quantity
        }
    })

    res.json(cart)


}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    await prismaClient.cartItem.delete({
        where: {
            id: +req.params.id
        }
    })

    res.json({ success: true })
 }

export const changeQuantity = async (req: Request, res: Response) => { 
    const validatedData = ChangeQuantitySchema.parse(req.body);
   const updatedCart = await prismaClient.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }
    })

    res.json(updatedCart)
}

export const getCart = async (req: Request, res: Response) => { 
    const user = req.user as any

    const cart = await prismaClient.cartItem.findMany({
        where: {
            userID: user.id
        },
        include: {
            product: true
        }
    })

    res.json(cart)


}