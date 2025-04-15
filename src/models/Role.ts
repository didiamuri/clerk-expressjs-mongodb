import mongoose from "mongoose";
import {Role} from "@src/types/Role";

const schema = new mongoose.Schema<Role>({
    name: {type: String, required: true},
    key: {type: String, required: true},
    permissions: [{type: String, required: true}],
}, {
    timestamps: true
});

schema.index({name: 1, key: 1});

schema.set("toJSON", { virtuals: false, versionKey: false });

export default mongoose.model<Role>("Role", schema);