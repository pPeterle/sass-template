import z from "zod";

const schema = z.object({
	MONGO_URI: z.string(),
});

export const envs = schema.parse(process.env);
