import { FILTER_CONDITION_TYPE } from "@graphql/filter/filterType";
import { createLoader } from "../../../graphql/createLoader";
import { registerLoader } from "../../../graphql/loaderRegister";
import { testFilterMapping } from "./TestFilter";
import { TestModel } from "./TestModel";

export const TestLoader = createLoader({
  model: TestModel,
  loaderName: "TestLoader",
  viewerCanSeeConnection: () => true,
  filterMapping: testFilterMapping,
});

registerLoader("TestLoader", TestLoader.getLoader);
