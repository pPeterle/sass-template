/* eslint max-classes-per-file: 0 */

import DataLoader from "dataloader";
import type { FilterQuery, Model, PipelineStage } from "mongoose";
import type { GraphQLContext } from "./context";
import { buildMongoConditionsFromFilters } from "./filter/buildMongoConditionsFromFilters";
import type { FilterMapping } from "./filter/filterType";
import { mongooseLoader } from "./utils/mongooseLoader";
import type { DataLoaderKey } from "./utils/types";
import {
  type PipeParams,
  withConnectionAggregate,
} from "./utils/withConnectionAggregate";
import { withFilter } from "./utils/withFilter";

type CreateLoaderArgs<T> = {
  model: Model<T>;
  viewerCanSee?: (context: GraphQLContext, data: T) => Promise<T | null>;
  viewerCanSeeConnection?: (context: GraphQLContext) => boolean;
  loaderName: string;
  filterMapping?: FilterMapping<T>;
  defaultFilter?: FilterQuery<T>;
  withRemovedAt?: boolean;
};

export const createLoader = <T>({
  model,
  viewerCanSee,
  viewerCanSeeConnection,
  loaderName,
  filterMapping = {},
  defaultFilter,
  withRemovedAt = true,
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

  const getPipeline = ({ context, args }: PipeParams): PipelineStage[] => {
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

    const builtMongoConditions = buildMongoConditionsFromFilters(
      {
        context: context,
        filters: {
          ...defaultFilter,
          ...args.filters
        },
        mapping: filterMapping
      }
    );

    console.log(builtMongoConditions)

    const pipeline: PipelineStage[] = [
      {
        $match: {
          ...removedAtMatch,
          ...builtMongoConditions.conditions,
        },
      },
      ...builtMongoConditions.pipeline,
    ];

    console.log(pipeline)

    return pipeline;
  };

  const loadAll = withConnectionAggregate({
    model,
    loader: load,
    pipeFn: getPipeline,
    viewerCanSee: viewerCanSeeConnection,
  });

  return {
    Wrapper: model,
    getLoader,
    clearCache,
    load,
    loadAll,
  };
};
