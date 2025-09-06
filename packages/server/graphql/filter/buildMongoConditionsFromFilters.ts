import type { GraphQLContext } from "@graphql/context";
import type { PipelineStage } from "mongoose";
import {
	type BuildedConditionSet,
	FILTER_CONDITION_TYPE,
	type FilterFieldMapping,
} from "./filterType";

export function buildMongoConditionsFromFilters<TValue>({
	context,
	filters,
	mapping = {},
}: {
	context: GraphQLContext;
	filters?: Record<string, unknown>;
	mapping?: { [key: string]: FilterFieldMapping<TValue> };
}): BuildedConditionSet {
	if (!filters) {
		return { conditions: {}, pipeline: [] };
	}

	const filterQueryResult: Record<string, unknown> = {};

	const pipelineResult: PipelineStage[] = [];
	Object.keys(filters).forEach((key) => {
		const filter: FilterFieldMapping<TValue> | undefined = mapping[key];
		const condition = filters[key] as TValue;

		if (!filter) return;

		if (filter.type === FILTER_CONDITION_TYPE.MATCH_1_TO_1) {
			filterQueryResult[key] = condition;
		}

		if (filter.type === FILTER_CONDITION_TYPE.CUSTOM_CONDITION) {
			const formattedCondition = filter.format({ context, value: condition });
			filterQueryResult[key] = formattedCondition;
		}

		if (filter.type === FILTER_CONDITION_TYPE.AGGREGATE_PIPELINE) {
			const pipeline = filter.pipeline({ context, value: condition });
			pipeline.forEach((value) => pipelineResult.push(value));
		}
	});

	return {
		conditions: filterQueryResult,
		pipeline: pipelineResult,
	};
}
