import { Request, Response } from "express";
import { Order } from "../../models/order.model";

export const adminOrderController = {
  // GET /api/v1/admin/orders
  async getAllOrders(_req: Request, res: Response) {
    const orders = await Order.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: orders,
    });
  },

  // PATCH /api/v1/admin/orders/:id/status
  async updateOrderStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(id).populate("user", "fullName email");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status as any;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  },
};
