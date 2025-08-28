// biome-ignore assist/source/organizeImports: <explanation>
import { printSchema } from "graphql";
import { join } from "node:path";
import { schema } from "../src/schema/schema";

(async () => {
	await Bun.write(
		join(__dirname, "../schema/schema.graphql"),
		printSchema(schema),
	);

	process.exit(0);
})();
