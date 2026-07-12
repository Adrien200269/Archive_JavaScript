import { Request, Response } from "express";
import { Order } from "../../models/order.model";
import { User } from "../../models/user.model";
import { Product } from "../../models/product.model";

export const adminAnalyticsController = {
  async getAnalytics(_req: Request, res: Response) {
    const now = new Date();

    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [revenue1d, revenue1w, revenue1m] = await Promise.all([
      revenueSince(dayAgo),
      revenueSince(weekAgo),
      revenueSince(monthAgo),
    ]);

    const [orders1d, orders1w, orders1m] = await Promise.all([
      orderCountSince(dayAgo),
      orderCountSince(weekAgo),
      orderCountSince(monthAgo),
    ]);

    const [totalUsers, totalProducts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
    ]);

    const last30Days: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const start = new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
      const end = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const rev = await revenueBetween(start, end);
      last30Days.push({
        date: start.toISOString().slice(0, 10),
        revenue: rev,
      });
    }

    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusMap: Record<string, number> = {
      Pending: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    for (const item of ordersByStatus) {
      statusMap[item._id] = item.count;
    }

    return res.status(200).json({
      success: true,
      data: {
        revenue: { '1d': revenue1d, '7d': revenue1w, '30d': revenue1m },
        orders: { '1d': orders1d, '7d': orders1w, '30d': orders1m },
        totalUsers,
        totalProducts,
        revenueByDay: last30Days,
        ordersByStatus: statusMap,
      },
    });
  },
};

async function revenueSince(date: Date): Promise<number> {
  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: date }, status: { $ne: "Cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  return result.length > 0 ? result[0].total : 0;
}

async function revenueBetween(start: Date, end: Date): Promise<number> {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lt: end },
        status: { $ne: "Cancelled" },
      },
    },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  return result.length > 0 ? result[0].total : 0;
}

async function orderCountSince(date: Date): Promise<number> {
  return Order.countDocuments({ createdAt: { $gte: date } });
}
