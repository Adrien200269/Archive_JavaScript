import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { initiatePayment, lookupPayment } from "../services/payment.service";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const WEBSITE_URL = process.env.WEBSITE_URL || CLIENT_URL;

export const paymentController = {
  async createOrderWithPayment(req: Request, res: Response) {
    const { items, delivery, paymentMethod } = req.body;
    const userId = (req as any).userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order items are required" });
    }

    if (!delivery?.name || !delivery?.address || !delivery?.phone) {
      return res.status(400).json({ success: false, message: "Delivery details are required" });
    }

    if (!paymentMethod || !["cod", "khalti"].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const { productId, quantity } = item;
      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ success: false, message: "Invalid product ID or quantity" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${productId} not found` });
      }

      totalPrice += product.price * quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
      });
    }

    if (paymentMethod === "cod") {
      const order = await Order.create({
        user: userId,
        items: orderItems,
        totalPrice,
        delivery,
        paymentMethod: "cod",
        paymentStatus: "pending",
      });

      return res.status(201).json({
        success: true,
        data: order,
      });
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalPrice,
      delivery,
      paymentMethod: "khalti",
      paymentStatus: "pending",
    });

    const khalti = await initiatePayment({
      returnUrl: `${CLIENT_URL}/api/v1/payments/khalti/callback`,
      websiteUrl: WEBSITE_URL,
      amount: totalPrice,
      purchaseOrderId: order._id.toString(),
      purchaseOrderName: `Order #${order._id.toString().slice(-6).toUpperCase()}`,
      customerInfo: {
        name: delivery.name,
        email: (req as any).userEmail || "",
        phone: delivery.phone,
      },
    });

    order.stripePaymentIntentId = khalti.pidx;
    await order.save();

    return res.status(201).json({
      success: true,
      data: {
        orderId: order._id,
        paymentUrl: khalti.payment_url,
        pidx: khalti.pidx,
      },
    });
  },

  async khaltiCallback(req: Request, res: Response) {
    const { pidx, status } = req.query as { pidx?: string; status?: string };

    if (!pidx) {
      return res.redirect(`${CLIENT_URL}/dashboard?payment=error&message=missing_pidx`);
    }

    const order = await Order.findOne({ stripePaymentIntentId: pidx });
    if (!order) {
      return res.redirect(`${CLIENT_URL}/dashboard?payment=error&message=order_not_found`);
    }

    if (status === "Completed") {
      const lookup = await lookupPayment(pidx);
      if (lookup.status === "Completed") {
        order.paymentStatus = "paid";
        await order.save();
        return res.redirect(`${CLIENT_URL}/dashboard?payment=success&order=${order._id}`);
      }
    }

    order.paymentStatus = "failed";
    await order.save();
    return res.redirect(`${CLIENT_URL}/dashboard?payment=failed`);
  },

  async verifyPayment(req: Request, res: Response) {
    const { pidx } = req.body;

    if (!pidx) {
      return res.status(400).json({ success: false, message: "pidx is required" });
    }

    const lookup = await lookupPayment(pidx);
    return res.json({ success: true, data: lookup });
  },
};
