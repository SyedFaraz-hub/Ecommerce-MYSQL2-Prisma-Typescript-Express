import { Request, Response } from "express";
import { AddressSchema, updateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestsException } from "../exceptions/bad-request";



export const addAddress = async (req: Request, res: Response) => {
  AddressSchema.parse(req.body)

  const user = req.user as any

  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userID: user.id
    }
  })

  res.json(address)
}

export const deleteAddress = async (req: Request, res: Response) => {

  try {
    const address = await prismaClient.address.delete({
      where: {
        id: +req.params.id
      }
    })

    res.json({Success: true})
  

  } catch (error) {
    throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND)
  }

}

export const listAddress = async (req: Request, res: Response) => {
  const user = req.user as any

  const address = await prismaClient.address.findMany({
    where: {
      userID: user.id
    }
  })

  res.json(address)
}

export const updateUser = async(req: Request, res: Response) => {
  const user = req.user as any

  const validatedData = updateUserSchema.parse(req.body)
  let shippingAddress: Address;
  let billingAddress: Address;
  console.log(validatedData)
  if(validatedData.defaultShippingAddress) {
      try {
          shippingAddress = await prismaClient.address.findFirstOrThrow({
              where: {
                  id: +validatedData.defaultShippingAddress
              }
          })
          
      } catch(error) {
          throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
      }
      if(shippingAddress.userID != user.id) {
          throw new BadRequestsException('Address does not belong to user', ErrorCode.ADDRESS_NOT_FOUND)
      }
  }
  if(validatedData.defaultBillingAddress) {
      try {
          billingAddress = await prismaClient.address.findFirstOrThrow({
              where: {
                  id: +validatedData.defaultBillingAddress
              }
          })
          
      } catch(error) {
          throw new NotFoundException('Address not found.', ErrorCode.ADDRESS_NOT_FOUND)
      }
      if(billingAddress.userID != user.id) {
          throw new BadRequestsException('Address does not belong to user', ErrorCode.ADDRESS_NOT_FOUND)
      }
  }

  const updatedUser = await prismaClient.user.update({
      where:{
          id: user.id
      },
      data: validatedData as any
  })
  res.json(updatedUser)

}


export const listUser = async(req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    skip: +req.query.skip || 0,
    take: 5
  })
  res.json(users)
}

export const getUserById = async(req: Request, res: Response) => {
  try {
  const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +req.params.id
      }, 
      include: {
        addresses: true
      }
    })


    res.json(user)


  } catch (error) {
     throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
  }
}

export const changeUserRole = async(req: Request, res: Response ) => {

   try {
    const User = await prismaClient.user.update({
      where: {
        id: +req.params.id
      },
      data: {
        role: req.body.role
      }
    })

    res.json(User)
   } catch (error) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
   }
}