import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface IDelivery {
  name: string;
  address: string;
  phone: string;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  delivery: IDelivery;
  paymentMethod: "cod" | "khalti";
  paymentStatus: "pending" | "paid" | "failed";
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
  name: {
    type: String,
    required: [true, "Product name snapshot is required"],
  },
  price: {
    type: Number,
    required: [true, "Product price snapshot is required"],
  },
  imageUrl: {
    type: String,
    required: [true, "Product image snapshot is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
});

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    items: {
      type: [orderItemSchema],
      required: [true, "Order must contain at least one item"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    delivery: {
      name: { type: String, required: [true, "Delivery name is required"] },
      address: { type: String, required: [true, "Delivery address is required"] },
      phone: { type: String, required: [true, "Delivery phone is required"] },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "khalti"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    stripePaymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
