import { TestMutations } from "@/modules/teste/mutations";
import { GraphQLObjectType } from "graphql";

export const MutationType = new GraphQLObjectType({
	name: "Mutation",
	fields: () => ({
		...TestMutations,
	}),
});
