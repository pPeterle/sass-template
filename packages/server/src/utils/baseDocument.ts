import type { Types } from "mongoose";

export type BaseDocument = {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt?: Date | null;
	deletedAt?: Date | null;
};
