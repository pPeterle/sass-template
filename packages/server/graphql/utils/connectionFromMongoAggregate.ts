import type { GraphQLContext } from "@graphql/context";
import type { ConnectionArguments } from "graphql-relay";
import type { Aggregate, PipelineStage, Types } from "mongoose";
import {
  calculateOffsets,
  getPageInfo,
  offsetToCursor,
} from "./connectionFromMongoCursor";
import type { DataLoaderKey, NodeType } from "./types";
import type { PipeArgs } from "./withConnectionAggregate";

const cloneAggregate = (aggregate: Aggregate<unknown>): Aggregate<unknown> =>
  aggregate.model().aggregate(aggregate.pipeline()).allowDiskUse(true);

export type ConnectionOptionsAggregate<T> = {
  aggregate: Aggregate<T[]>;
  context: GraphQLContext;
  args?: PipeArgs;
  loader: (
    ctx: GraphQLContext,
    id: DataLoaderKey,
    bypassViewerCanSee?: boolean,
  ) => NodeType<T>;
  raw?: boolean; // loader should receive raw result
  allowDiskUse?: boolean;
  shouldCount?: boolean;
  bypassViewerCanSee?: boolean;
};

export const getTotalCount = async (
  aggregate: Aggregate<unknown>,
  allowDiskUse = true,
) => {
  const resultCount = (await cloneAggregate(aggregate)
    .allowDiskUse(allowDiskUse)
    .count("total")) as { total: number }[];

  return resultCount.length ? resultCount[0].total : 0;
};

/**
 * Your aggregate must return documents with _id fields
 *  those _id's are the ones going to be passed to the loader function
 */
export const connectionFromMongoAggregate = async <T>({
  aggregate,
  context,
  args,
  loader,
  raw = false,
  allowDiskUse = true,
  shouldCount = false,
  bypassViewerCanSee = false,
}: ConnectionOptionsAggregate<T>) => {
  // https://github.com/Automattic/mongoose/blob/367261e6c83e7e367cf0d3fbd2edea4c64bf1ee2/lib/aggregate.js#L46
  const clonedAggregate = cloneAggregate(aggregate).allowDiskUse(allowDiskUse);
  const totalCount = shouldCount
    ? await getTotalCount(aggregate, allowDiskUse)
    : null;

  const {
    first,
    last,
    before,
    after,
    skip,
    limit,
    beforeOffset,
    afterOffset,
    startOffset,
    endOffset,
    startCursorOffset,
    endCursorOffset,
  } = calculateOffsets({ args, totalCount });

  // If supplied slice is too large, trim it down before mapping over it.
  if (skip > 0) {
    clonedAggregate.skip(skip);
  }

  // limit should never be 0 because $slice returns an error if it is.
  clonedAggregate.limit(limit || 1);

  // avoid large objects retrieval from collection
  const slice = (await (raw
    ? clonedAggregate
    : clonedAggregate.project("_id"))) as { _id: Types.ObjectId }[];

  const edges: {
    cursor: string;
    node: NodeType<T>;
  }[] = slice.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: loader(
      context,
      raw ? (value as unknown as DataLoaderKey) : value._id,
      bypassViewerCanSee,
    ),
  }));

  return {
    edges,
    count: totalCount,
    endCursorOffset,
    startCursorOffset,
    pageInfo: getPageInfo({
      edges,
      before,
      after,
      first,
      last,
      afterOffset,
      beforeOffset,
      startOffset,
      endOffset,
      totalCount,
      startCursorOffset,
      endCursorOffset,
    }),
  };
};
