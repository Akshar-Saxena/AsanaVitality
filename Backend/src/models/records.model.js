import mongoose from "mongoose";

const recordSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    records: {
        type: Array,
        defaultValue: [],
    },
});

const recordModel = mongoose.model("records", recordSchema);

export default recordModel;
