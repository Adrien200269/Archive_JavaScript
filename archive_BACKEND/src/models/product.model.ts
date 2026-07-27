import mongoose, { Document, Schema } from "mongoose";

/**
 * Mongoose document interface for a Product.
 * Extends Document to include Mongoose's built-in fields (_id, __v, etc.).
 */
export interface IProduct extends Document {
  name: string;
  price: number;
  imageUrl: string;
  isFavourite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema definition for a Product document.
 * Automatically adds `createdAt` and `updatedAt` timestamp fields.
 */
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Product image is required"],
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
