import { nodeField, nodesField } from "@graphql/node/typeRegister";
import { GraphQLObjectType } from "graphql";
import { connectionArgs, globalIdField } from "graphql-relay";
import { FilterInputType } from "@/modules/teste/TestFilter";
import { TestLoader } from "@/modules/teste/TestLoader";
import { TestConnection } from "@/modules/teste/TestType";

export const QueryType = new GraphQLObjectType({
	name: "Query",
	description: "Main Query",
	fields: () => ({
		id: globalIdField("Query"),
		node: nodeField,
		nodes: nodesField,
		test: {
			type: TestConnection.connectionType,
			args: {
				...connectionArgs,
				filters: {
					type: FilterInputType,
				},
			},
			resolve: (_root, args, context) => TestLoader.loadAll({ args, context }),
		},
	}),
});
