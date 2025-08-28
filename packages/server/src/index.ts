import yoga from "@elysiajs/graphql-yoga";
import { getContext } from "@graphql/context";
import { Elysia } from "elysia";
import { connectDatabase } from "../config/db";
import { schema } from "./schema/schema";

const init = async () => {
	await connectDatabase();

	const app = new Elysia()
		.use(
			yoga({
				schema,
				context: getContext,
			}),
		)
		.listen(3000);

	app.get("/teste", () => "Hello World!");

	console.log(
		`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
	);
};

init();
