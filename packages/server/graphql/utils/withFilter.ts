import type { ConnectionArguments } from "graphql-relay";
import type { PipelineStage } from "mongoose";
import type { PipeArgs } from "./withConnectionAggregate";

type ArgsWithFilter = {
  filters: PipelineStage;
  [key: string]: PipelineStage;
} & ConnectionArguments;

export const withFilter = ({
  args,
  filters,
}: {
  args: ArgsWithFilter;
  filters?: PipeArgs;
}) => ({
  ...args,
  filters: {
    ...filters,
    ...(args?.filters || {}),
  },
});
