/* eslint max-classes-per-file: 0 */

import DataLoader from "dataloader";
import type { Model, PipelineStage } from "mongoose";
import type { GraphQLContext } from "./context";
import { buildMongoConditionsFromFilters } from "./filter/buildMongoConditionsFromFilters";
import type { FilterMapping } from "./filter/filterType";
import { debugConsole } from "./utils/debugConsole";
import { mongooseLoader } from "./utils/mongooseLoader";
import type { DataLoaderKey } from "./utils/types";
import { withAggregateCursor } from "./utils/withAggregateCursor";
import {
  type PipeArgs,
  withConnectionAggregate,
} from "./utils/withConnectionAggregate";
import { withFilter } from "./utils/withFilter";

type CreateLoaderArgs<T> = {
  model: Model<T>;
  viewerCanSee?: (context: GraphQLContext, data: T) => Promise<T | null>;
  viewerCanSeeConnection?: (context: GraphQLContext) => boolean;
  loaderName: string;
  filterMapping?: FilterMapping<GraphQLContext, any>;
  defaultArgs?: Record<string, unknown>;
  withRemovedAt?: boolean;
  __typename?: string;
  debug?: boolean;
};

export const createLoader = <T>({
  model,
  viewerCanSee,
  viewerCanSeeConnection,
  loaderName,
  filterMapping = {},
  defaultArgs = {},
  withRemovedAt = true,
  debug = false,
}: CreateLoaderArgs<T>) => {
  const getLoader = () =>
    new DataLoader((ids: readonly string[]) => {
      return mongooseLoader(model, ids);
    });

  const load = async (
    context: GraphQLContext,
    id: DataLoaderKey,
    bypassViewerCanSee = false,
  ): Promise<T | null> => {
    if (!id) {
      return null;
    }

    try {
      const data = await context.dataloaders[loaderName].load(id.toString());

      if (!data) {
        return null;
      }

      if (!viewerCanSee || bypassViewerCanSee) {
        return data ? new model(data) : null;
      }

      const filteredData = await viewerCanSee(context, data);

      return filteredData ? new model(filteredData) : null;
    } catch (err) {
      // eslint-disable-next-line
      console.log("loader load err", err);

      return null;
    }
  };

  const clearCache = ({ dataloaders }: GraphQLContext, id: string) =>
    dataloaders[loaderName].clear(id.toString());

  const getPipeline = ({ context, args }: PipeArgs): PipelineStage[] => {
    const getRemovedAtMatch = () => {
      if ("withRemovedAt" in args) {
        if (args.withRemovedAt) {
          return {
            removedAt: null,
          };
        }

        return {};
      }

      if (withRemovedAt) {
        return {
          removedAt: null,
        };
      }

      return {};
    };

    const removedAtMatch = getRemovedAtMatch();

    if (!filterMapping) {
      return [
        {
          $match: {
            ...removedAtMatch,
          },
        },
      ];
    }

    const argsWithDefaults = withFilter({ args, filters: defaultArgs });

    const builtMongoConditions = buildMongoConditionsFromFilters(
      context,
      argsWithDefaults.filters,
      filterMapping,
    );

    const pipeline: PipelineStage[] = [
      {
        $match: {
          ...removedAtMatch,
          ...builtMongoConditions.conditions,
        },
      },
      ...builtMongoConditions.pipeline,
    ];

    if (debug) {
      debugConsole(pipeline);
    }

    return pipeline;
  };

  const loadAll = withConnectionAggregate({
    model,
    loader: load,
    pipeFn: getPipeline,
    viewerCanSee: viewerCanSeeConnection,
  });

  const loadAllCursor = withAggregateCursor({
    model,
    pipeFn: getPipeline,
  });

  return {
    Wrapper: model,
    getLoader,
    clearCache,
    load,
    loadAll,
    getPipeline,
    loadAllCursor,
  };
};
