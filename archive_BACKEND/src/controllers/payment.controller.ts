import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import { initiatePayment, lookupPayment } from "../services/payment.service";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
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
      returnUrl: `${BACKEND_URL}/api/v1/payments/khalti/callback`,
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
      return res.send(paymentResultPage("error", "Missing payment ID"));
    }

    const order = await Order.findOne({ stripePaymentIntentId: pidx });
    if (!order) {
      return res.send(paymentResultPage("error", "Order not found"));
    }

    if (status === "Completed") {
      const lookup = await lookupPayment(pidx);
      if (lookup.status === "Completed") {
        order.paymentStatus = "paid";
        await order.save();
        return res.send(paymentResultPage("success", "Payment successful! You can now close this tab and return to the app."));
      }
    }

    order.paymentStatus = "failed";
    await order.save();
    return res.send(paymentResultPage("failed", "Payment failed. Please try again in the app."));
  },

  async verifyPayment(req: Request, res: Response) {
    const { pidx } = req.body;

    if (!pidx) {
      return res.status(400).json({ success: false, message: "pidx is required" });
    }

    const lookup = await lookupPayment(pidx);
    return res.json({ success: true, data: lookup });
  },

  async orderPaymentStatus(req: Request, res: Response) {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.json({
      success: true,
      data: {
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
      },
    });
  },
};

function paymentResultPage(status: string, message: string): string {
  const color = status === "success" ? "#2E7D32" : status === "failed" ? "#E53935" : "#F57C00";
  const icon = status === "success" ? "✓" : "✗";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Payment Status</title>
<style>
  body{font-family:-apple-system,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f0f0f3;color:#111}
  .card{background:#fff;border-radius:16px;padding:40px;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,0.07);max-width:360px;margin:20px}
  .icon{font-size:48px;width:64px;height:64px;border-radius:32px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:#fff;background:${color}}
  h2{margin:0 0 8px;font-size:20px}
  p{margin:0 0 24px;color:#666;font-size:14px;line-height:1.5}
  .btn{display:inline-block;padding:12px 24px;border-radius:12px;background:#111;color:#fff;text-decoration:none;font-size:14px;font-weight:600}
</style></head>
<body><div class="card"><div class="icon">${icon}</div><h2>Payment ${status}</h2><p>${message}</p><a class="btn" href="javascript:window.close()">Close</a></div></body>
</html>`;
}
