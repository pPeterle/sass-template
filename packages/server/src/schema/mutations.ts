import { GraphQLObjectType } from "graphql";
import { TestMutations } from "@/modules/teste/mutations";

export const MutationType = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		...TestMutations,
	}),
});
