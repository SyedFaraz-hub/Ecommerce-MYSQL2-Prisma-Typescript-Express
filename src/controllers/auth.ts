import { NextFunction, Request, Response } from "express"
import { prismaClient } from ".."
import { compareSync, hashSync } from "bcrypt"
import * as jwt from "jsonwebtoken"
import { JWT_SECRET } from "../secrect"
import { BadRequestsException } from "../exceptions/bad-request"
import { ErrorCode } from "../exceptions/root"
import { signUpSchema } from "../schema/users"
import { NotFoundException } from "../exceptions/not-found"



export const signup = async (req: Request, res: Response) => {

    signUpSchema.parse(req.body)
    const { email, password, name } = req.body

    let user = await prismaClient.user.findFirst({ where: { email } })

    if (user) {
        new BadRequestsException('User already exists!', ErrorCode.USER_ALREADY_EXIST)
    }

    user = await prismaClient.user.create({
        data: {
            name,
            email,
            password: hashSync(password, 10)
        }
    })

    res.json(user)


}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    let user = await prismaClient.user.findFirst({ where: { email } })

    if (!user) {
        throw new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND)
    }

    if (!compareSync(password, user.password)) {
        throw new BadRequestsException('Incorrect Password.', ErrorCode.INCORRECT_PASSWORD)
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET)

    res.json({ user, token })
}

// Property 'user' does not exist on type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'

// /me ->  return the logged in user
export const me = async (req: Request, res:Response) => {

    res.json(req.user)
}
