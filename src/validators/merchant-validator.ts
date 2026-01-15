import { z } from "zod";

export const MerchantIdSchema = z.string().min(1);

export const MerchantCreateSchema = z.object({
	name: z.string().min(1)
});

export const MerchantUpdateSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1)
});
