export type DataLoaders = Record<string, any>;

const loaders: {
	[Name in keyof DataLoaders]: () => DataLoaders[Name];
} = {};

const registerLoader = <Name extends keyof DataLoaders>(
	key: Name,
	getLoader: () => DataLoaders[Name],
) => {
	loaders[key] = getLoader;
};

const getDataloaders = (): DataLoaders =>
	(Object.keys(loaders) as (keyof DataLoaders)[]).reduce(
		(prev, loaderKey) => ({
			...prev,
			[loaderKey]: loaders[loaderKey](),
		}),
		{},
	);

export { getDataloaders, registerLoader };
