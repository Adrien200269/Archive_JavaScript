import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";

export const orderController = {
  // POST /api/v1/orders
  async createOrder(req: Request, res: Response) {
    const { items, delivery } = req.body;
    const userId = (req as any).userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required and must be an array",
      });
    }

    if (!delivery || !delivery.name || !delivery.address || !delivery.phone) {
      return res.status(400).json({
        success: false,
        message: "Delivery details (name, address, phone) are required",
      });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID or quantity in order items",
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${productId} not found`,
        });
      }

      const price = product.price;
      const name = product.name;
      const imageUrl = product.imageUrl;

      totalPrice += price * quantity;
      orderItems.push({
        product: product._id,
        name,
        price,
        imageUrl,
        quantity,
      });
    }

    const order = new Order({
      user: userId,
      items: orderItems,
      totalPrice,
      delivery: {
        name: delivery.name,
        address: delivery.address,
        phone: delivery.phone,
      },
    });

    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  },

  // GET /api/v1/orders/my
  async getMyOrders(req: Request, res: Response) {
    const userId = (req as any).userId;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  },
};
