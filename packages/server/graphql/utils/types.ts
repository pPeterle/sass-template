import type { Types } from "mongoose";

export type DataLoaderKey = Types.ObjectId | string | undefined | null;

export type NodeType<T> = Promise<T | null>;
