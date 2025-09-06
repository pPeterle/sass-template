import type { GraphQLContext } from "@graphql/context.js";
import type { GraphQLResolveInfo } from "graphql";
import type { ConnectionArguments } from "graphql-relay";
import type { Model, PipelineStage } from "mongoose";
import { NullConnection } from "../connection/NullConection.js";
import { infoHasOneOfFields } from "../fields/getFieldsByInfo.js";
import { connectionFromMongoAggregate } from "./connectionFromMongoAggregate.js";
import type { DataLoaderKey, NodeType } from "./types.js";

export type PipeArgs = {
	filters?: Record<string, unknown>;
} & ConnectionArguments;

export type PipeParams = {
	info?: GraphQLResolveInfo;
	bypassViewerCanSee?: boolean;
	args: PipeArgs;
	context: GraphQLContext;
};

type Args<T> = {
	model: Model<T>;
	loader: (
		context: GraphQLContext,
		id: DataLoaderKey,
		bypassViewerCanSee?: boolean,
	) => NodeType<T>;
	pipeFn: (params: PipeParams) => PipelineStage[];
	viewerCanSee?: (context: GraphQLContext) => boolean;
};

export const withConnectionAggregate =
	<T>({ loader, model, pipeFn, viewerCanSee }: Args<T>) =>
	async (params: PipeParams) => {
		const aggregatePipeline = pipeFn(params);

		const { context, info, args, bypassViewerCanSee } = params;

		if (viewerCanSee && !bypassViewerCanSee) {
			if (!viewerCanSee(context)) {
				return NullConnection;
			}
		}

		const shouldCount = info
			? infoHasOneOfFields(info, ["count", "totalCount"])
			: false;

		const aggregate = model.aggregate<T>(aggregatePipeline).allowDiskUse(true);

		return connectionFromMongoAggregate<T>({
			aggregate,
			context,
			args,
			loader,
			shouldCount,
			bypassViewerCanSee,
		});
	};
