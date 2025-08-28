import type { Connection, Model, Schema } from "mongoose";
import { getConnection } from "./getConnection";

export type GetModelByConnectionArgs = {
	connectionName: string;
	schema: Schema;
	name: string;
};
export const getModelByConnection = ({
	connectionName,
	name,
	schema,
}: GetModelByConnectionArgs) => {
	const connection = getConnection(connectionName) as Connection;

	return connection.model(name, schema);
};

type SchemaMultiDB = Schema & {
	name: string;
	databaseName: string;
};
export const getModelBySchema = (
	schema: SchemaMultiDB,
	fallback = true,
): Model<SchemaMultiDB> | null => {
	const connection = getConnection(schema.databaseName, fallback);

	if (!connection) {
		return null;
	}

	return connection.model(schema.name, schema);
};
