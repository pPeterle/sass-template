import type { GraphQLContext } from "@graphql/context";
import type { FilterQuery, PipelineStage } from "mongoose";

export const FILTER_CONDITION_TYPE = {
	// something that could be used on find() or $match
	MATCH_1_TO_1: "MATCH_1_TO_1",
	CUSTOM_CONDITION: "CUSTOM_CONDITION", // create a custom condition based on value
	AGGREGATE_PIPELINE: "AGGREGATE_PIPELINE",
} as const;

type FunctionArgs<TValue> = {
	value: TValue;
	context: GraphQLContext;
};

export type BuildedConditionSet = {
	conditions: Record<string, unknown>;
	pipeline: PipelineStage[];
};
export type FilterFieldMappingMatch = {
	type: typeof FILTER_CONDITION_TYPE.MATCH_1_TO_1;
};
export type FilterFieldMappingPipeline<TValue> = {
	type: typeof FILTER_CONDITION_TYPE.AGGREGATE_PIPELINE;
	pipeline: (args: FunctionArgs<TValue>) => PipelineStage[];
};
export type FilterFieldMappingCustomCondition<TValue> = {
	type: typeof FILTER_CONDITION_TYPE.CUSTOM_CONDITION;
	format: (args: FunctionArgs<TValue>) => FilterQuery<TValue>;
};
export type FilterFieldMapping<TValue> =
	| FilterFieldMappingMatch
	| FilterFieldMappingPipeline<TValue>
	| FilterFieldMappingCustomCondition<TValue>;

export type FilterMapping<TValue> = {
	[key: string]: FilterFieldMapping<TValue>;
};
