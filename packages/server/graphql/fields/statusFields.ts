declare const errorField: {
	error: {
		type: import("graphql").GraphQLScalarType<string, string>;
		description: string;
		resolve: ({ error }: { error: string }) => string;
	};
};
declare const successField: {
	success: {
		type: import("graphql").GraphQLScalarType<boolean, boolean>;
		description: string;
		resolve: ({ success }: { success: boolean }) => boolean;
	};
};
export { errorField, successField };
