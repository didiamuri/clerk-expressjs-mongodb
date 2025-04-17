import mongoose from "mongoose";
import {IRole} from "@src/types";

const schema = new mongoose.Schema<IRole>({
    name: {type: String, required: true},
    key: {type: String, required: true},
    permissions: [{type: String, required: true}],
}, {
    timestamps: true
});

schema.index({name: 1, key: 1});

schema.set("toJSON", { virtuals: false, versionKey: false });

export default mongoose.model<IRole>("Role", schema);