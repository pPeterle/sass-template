import mongoose from "mongoose";
import { envs } from "./envs";

export const connectDatabase = async () => {
	// eslint-disable-next-line
	mongoose.connection.on("close", () =>
		console.log("Database connection closed."),
	);

	await mongoose.connect(envs.MONGO_URI);
};
