import { type DataLoaders, getDataloaders } from "./loaderRegister";

export type GraphQLContext = {
	dataloaders: DataLoaders;
};

export const getContext = (): GraphQLContext => {
	const dataloaders = getDataloaders();

	return {
		dataloaders,
	} as const;
};
