import type { GraphQLContext } from "@graphql/context.js";
import type { Model } from "mongoose";
import { NullConnection } from "../connection/NullConection.js";
import { infoHasOneOfFields } from "../fields/getFieldsByInfo.js";
import { connectionFromMongoAggregate } from "./connectionFromMongoAggregate.js";
import type { DataLoaderKey, NodeType } from "./types.js";

type Args<T> = {
	model: Model<T>;
	loader: (
		context: GraphQLContext,
		id: DataLoaderKey,
		bypassViewerCanSee?: boolean,
	) => NodeType<T>;
	pipeFn: (...p: unknown[]) => unknown[];
	viewerCanSee?: (context: GraphQLContext) => boolean;
};

export const withConnectionAggregate =
	<T>({ loader, model, pipeFn, viewerCanSee }: Args<T>) =>
	async (...params: unknown[]) => {
		const aggregatePipeline = pipeFn(...params);

		// expect context and then args as params
		const [context, args, info, bypassViewerCanSee] = params;

		if (viewerCanSee && !bypassViewerCanSee) {
			if (!viewerCanSee(context)) {
				return NullConnection;
			}
		}

		// await debugAggregate(model, aggregatePipeline);

		// debugConsole(aggregatePipeline);

		const shouldCount = infoHasOneOfFields(info, ["count", "totalCount"]);

		const aggregate = model.aggregate(aggregatePipeline).allowDiskUse(true);

		return connectionFromMongoAggregate({
			aggregate,
			context,
			args,
			loader,
			shouldCount,
			bypassViewerCanSee,
		});
	};
