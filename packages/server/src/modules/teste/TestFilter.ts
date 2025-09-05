import {
  FILTER_CONDITION_TYPE,
  type FilterMapping,
} from "@graphql/filter/filterType";
import { GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import type { ITest } from "./TestModel";

export const testFilterMapping: FilterMapping<ITest> = {
  search: {
    type: "MATCH_1_TO_1",
  },
  name: {
    type: "MATCH_1_TO_1",
  },
  teste2: {
    type: FILTER_CONDITION_TYPE.AGGREGATE_PIPELINE,
    pipeline: ({ context, value }) => {
      if (value) {
        const pipeline = [
          {
            $match: {
              teste: "123",
            },
          },
        ];

        return pipeline;
      }

      return [];
    },
  },
  metatags: {
    type: FILTER_CONDITION_TYPE.CUSTOM_CONDITION,
    format: ({ context, value }) => {
      return {
        name: {
          $eq: "equals tal",
        },
      };
    },
  },
  t: {
    type: FILTER_CONDITION_TYPE.AGGREGATE_PIPELINE,
    pipeline: ({ value }) => {
      if (!value) return [];

      return [
        {
          $match: {
            $or: [
              {
                'name': {
                  $regex: new RegExp(`${value}`, 'ig'),
                },
              },
            ],
          },
        },
      ]
    }
  },
};

export const FilterInputType = new GraphQLInputObjectType({
  name: "FilterInputType",
  description: "Used to filter test",
  fields: () => ({
    // OR: {
    //   type: new GraphQLList(FilterInputType),
    // },
    // AND: {
    //   type: new GraphQLList(FilterInputType),
    // },
    name: {
      type: GraphQLString
    },
    t: {
      type: GraphQLString
    }
  })
});
