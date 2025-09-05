type MongooseProjection = object | string;
type Mongoose$Document = {
  collection: {
    collectionName: string;
  };
  find(
    criteria?: Record<string, unknown>,
    projection?: MongooseProjection,
    options?: Record<string, unknown>,
  ): any;
};

export const mongooseLoader = async (
  model: Mongoose$Document,
  keys: readonly string[],
  lean = true,
  keyField = "_id",
) => {
  // can use apm metrics here

  const results = lean
    ? await model.find({ [keyField]: { $in: keys } }).lean()
    : await model.find({ [keyField]: { $in: keys } });

  return results;
};
