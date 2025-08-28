import mongoose from "mongoose";

export const getConnection = (connectionName: string, fallback = true) => {
	const connection = mongoose.connections.find(
		(c) => c.name === connectionName,
	);

	if (!connection) {
		if (!fallback) {
			return null;
		}

		// NOTE: Fallback on Mongoose model (will be assigned to the connections[0]),
		// to ensure that will register the new model even if does not have the right DB connected.
		// It could happen when does not have connected, missing the URI environment variable, etc.
		return mongoose;
	}

	return connection;
};
