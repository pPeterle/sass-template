import { GraphQLNonNull, GraphQLString } from "graphql";
import { mutationWithClientMutationId } from "graphql-relay";
import { TestLoader } from "../TestLoader";
import { TestModel } from "../TestModel";
import { TestType } from "../TestType";

export const addTestMutation = mutationWithClientMutationId({
	name: "AddAccount",
	inputFields: {
		name: {
			description: "Name of the account",
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async ({ name }: { name: string }) => {
		const test = await TestModel.create({
			name: name,
		});

		return test;
	},
	outputFields: {
		test: {
			type: TestType,
			resolve: async ({ id }, _, context) => {
				return await TestLoader.load(context, id);
			},
		},
	},
});
