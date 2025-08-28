import { createLoader } from "../../../graphql/createLoader";
import { registerLoader } from "../../../graphql/loaderRegister";
import { TestModel } from "./TestModel";

export const TestLoader = createLoader({
  model: TestModel,
  loaderName: "TestLoader",
  viewerCanSeeConnection: () => true,
});

registerLoader("TestLoader", TestLoader.getLoader);
