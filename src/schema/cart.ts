import { z } from "zod";


export const CreateCartSchema = z.object({
    productID: z.number(),
    quantity: z.number()
});

export const ChangeQuantitySchema = z.object({
    quantity: z.number()
});
