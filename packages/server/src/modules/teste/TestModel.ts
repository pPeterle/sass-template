import type { Model } from "mongoose";
import mongoose from "mongoose";
import type { BaseDocument } from "../../utils/baseDocument";

export interface ITest extends BaseDocument {
	name: string;
	active?: boolean;
}

const Schema = new mongoose.Schema<ITest>(
	{
		name: {
			type: String,
			required: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{
		collection: "Test",
		timestamps: true,
	},
);

export const TestModel: Model<ITest> = mongoose.model("Test", Schema);

TestModel.find({});
