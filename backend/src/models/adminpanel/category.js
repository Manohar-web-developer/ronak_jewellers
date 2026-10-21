
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            default: null,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        image: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        sortOrder: {
            type: Number,
            default: 0,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

export const categoryModel = mongoose.model(
    "category",
    categorySchema
);
