import type { ConnectionArguments } from "graphql-relay";

type ArgsWithFilter = {
	filters?: Record<string, unknown>;
	[key: string]: unknown;
} & ConnectionArguments;

export const withFilter = ({
	args,
	filters,
}: {
	args: ArgsWithFilter;
	filters: Record<string, unknown>;
}) => ({
	...args,
	filters: {
		...filters,
		...(args?.filters || {}),
	},
});
