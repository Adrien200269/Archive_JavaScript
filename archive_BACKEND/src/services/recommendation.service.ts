import { Product } from "../models/product.model";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";

/**
 * Keyword map used to match product names/descriptions to age groups.
 * Each key is an age group label and the value is a list of relevant style terms.
 */
const ageKeywords: Record<string, string[]> = {
  teen: ["street", "casual", "hoodie", "sneaker", "graphic", "denim", "cap", "urban"],
  young: ["trendy", "party", "fashion", "blazer", "slim", "formal", "smart", "minimal"],
  adult: ["classic", "elegant", "premium", "office", "comfort", "leather", "wool", "suit"],
  senior: ["comfort", "classic", "cotton", "loose", "walking", "cardigan", "flat", "warm"],
};

/**
 * Maps a numeric age to a broad demographic group string.
 *
 * @param age - The user's age in years.
 * @returns One of 'teen', 'young', 'adult', 'senior', or 'popular' if age is undefined.
 */
function getAgeGroup(age?: number): string {
  if (!age) return "popular";
  if (age <= 19) return "teen";
  if (age <= 30) return "young";
  if (age <= 55) return "adult";
  return "senior";
}

export const recommendationService = {
  async getRecommendations(userId?: string, limit = 8) {
    let userAge: number | undefined;

    if (userId) {
      const user = await User.findById(userId);
      userAge = user?.age;

      const collaborative = await this.collaborativeFiltering(userId, limit);
      if (collaborative.length > 0) return collaborative;
    }

    return this.ageAwarePopular(userAge, limit);
  },

  async collaborativeFiltering(userId: string, limit: number) {
    const userOrders = await Order.find({ user: userId }).populate<{
      items: { product: { _id: string } }[];
    }>("items.product");
    const userProductIds = [
      ...new Set(
        userOrders.flatMap((o) =>
          o.items.map((i) => i.product?._id?.toString()).filter(Boolean)
        )
      ),
    ];

    if (userProductIds.length === 0) return [];

    const similarUsersOrders = await Order.find({
      "items.product": { $in: userProductIds },
      user: { $ne: userId },
    }).populate<{ items: { product: { _id: string } }[] }>("items.product");

    const candidateMap = new Map<string, number>();
    for (const order of similarUsersOrders) {
      for (const item of order.items) {
        const pid = item.product?._id?.toString();
        if (pid && !userProductIds.includes(pid)) {
          candidateMap.set(pid, (candidateMap.get(pid) || 0) + 1);
        }
      }
    }

    const sorted = [...candidateMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    if (sorted.length === 0) return [];

    const products = await Product.find({ _id: { $in: sorted } });
    return sorted.map((id) => products.find((p) => p._id.toString() === id)).filter(Boolean);
  },

  async ageAwarePopular(age: number | undefined, limit: number) {
    const group = getAgeGroup(age);
    const keywords = ageKeywords[group] || [];

    let products: any[] = [];
    if (keywords.length > 0 && group !== "popular") {
      const regex = new RegExp(keywords.join("|"), "i");
      products = await Product.find({ name: regex }).sort({ createdAt: -1 }).limit(limit);
    }

    if (products.length === 0) {
      products = await this.popularProducts(limit);
    }

    return products;
  },

  async popularProducts(limit: number) {
    const popular = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.product", count: { $sum: "$items.quantity" } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    if (popular.length === 0) {
      return Product.find().sort({ createdAt: -1 }).limit(limit);
    }

    const ids = popular.map((p) => p._id);
    const products = await Product.find({ _id: { $in: ids } });
    return popular.map((p) => products.find((pr) => pr._id.toString() === p._id.toString())).filter(Boolean);
  },
};
