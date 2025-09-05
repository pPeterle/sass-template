import type { GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";

export const isInputAnInfo = (maybeInfo: unknown): boolean => {
	return (
		maybeInfo !== null &&
		typeof maybeInfo === "object" &&
		("fieldNodes" in maybeInfo || "fieldASTs" in maybeInfo)
	);
};

export const getFieldsByInfo = (info: GraphQLResolveInfo) => {
	if (!isInputAnInfo(info)) {
		return {};
	}

	return graphqlFields(info);
};

export const infoHasField = (info: GraphQLResolveInfo, field: string) => {
	const stringifiedFields = JSON.stringify(getFieldsByInfo(info));

	return stringifiedFields.includes(field);
};

export const infoHasOneOfFields = (
	info: GraphQLResolveInfo,
	fields: string[],
) => {
	const stringifiedFields = JSON.stringify(getFieldsByInfo(info));

	return fields.reduce(
		(acc, field) => acc || stringifiedFields.includes(field),
		false,
	);
};

export const infoHasAllFields = (
	info: GraphQLResolveInfo,
	fields: string[],
) => {
	const stringifiedFields = JSON.stringify(getFieldsByInfo(info));

	return fields.reduce(
		(acc, field) => acc && stringifiedFields.includes(field),
		true,
	);
};
