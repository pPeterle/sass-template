import type { GraphQLNonNull } from "graphql";
import type { Types } from "mongoose";

interface ModelObj {
	_id: Types.ObjectId;
}
export declare const objectIdResolver: {
	_id: {
		type: GraphQLNonNull<import("graphql").GraphQLScalarType<string, string>>;
		description: string;
		resolve: ({ _id }: ModelObj) => string;
	};
};
interface TimestampedObj {
	updatedAt?: Date | null;
	createdAt?: Date | null;
}
export declare const timestampResolver: {
	createdAt: {
		type: import("graphql").GraphQLScalarType<string, string>;
		resolve: (obj: TimestampedObj) => string | null;
	};
	updatedAt: {
		type: import("graphql").GraphQLScalarType<string, string>;
		resolve: (obj: TimestampedObj) => string | null;
	};
};
