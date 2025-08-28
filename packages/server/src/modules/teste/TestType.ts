import { connectionDefinitions } from "@graphql/connection/connectionDefinitions";
import type { GraphQLContext } from "@graphql/context";
import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import { globalIdField } from "graphql-relay";
import {
	nodeInterface,
	registerTypeLoader,
} from "../../../graphql/node/typeRegister";
import { TestLoader } from "./TestLoader";
import type { ITest } from "./TestModel";

export const TestType = new GraphQLObjectType<ITest, GraphQLContext>({
	name: "Account",
	fields: () => ({
		id: globalIdField("Account"),
		name: {
			type: GraphQLString,
			resolve: (test) => test.name,
		},
		active: {
			type: GraphQLBoolean,
			resolve: (test) => test.active ?? true,
		},
	}),
	interfaces: () => [nodeInterface],
});

registerTypeLoader(TestType, TestLoader.load);

export const TestConnection = connectionDefinitions({
	name: "Test",
	nodeType: TestType,
});
