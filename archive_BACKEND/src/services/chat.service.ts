import OpenAI from "openai";
import { User } from "../models/user.model";
import { Order } from "../models/order.model";
import { Product } from "../models/product.model";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY || "",
});

const SYSTEM_PROMPT = `You are a helpful shopping assistant for Archive Outfitters — a clothing brand. Your role is to assist customers with:

1. **Clothing questions** — answer questions about products, styles, sizing, fabric, price, availability, etc. based on the product catalog provided below.

2. **Personal information** — if the user is authenticated and asks about their account details (name, email, etc.), you can share their information from the user context provided.

3. **Order status** — if the user is authenticated and asks about their orders, you can look up their order information from the order context provided.

Always be friendly, concise, and helpful. If you don't know something, say so. Do not make up product details that aren't in the catalog.

PRODUCT CATALOG:
{productCatalog}

{userContext}

{orderContext}

Keep responses short and conversational. Use emojis occasionally to be friendly.`;

export const chatService = {
  async handleMessage(userId: string | null, message: string) {
    const [products, userInfo, userOrders] = await Promise.all([
      Product.find().lean(),
      userId ? User.findById(userId).select("-password").lean() : null,
      userId
        ? Order.find({ user: userId })
            .populate("items.product", "name price imageUrl")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()
        : null,
    ]);

    const productCatalog = products
      .map((p) => `- ${p.name} ($${p.price})`)
      .join("\n");

    let userContext = "The user is not logged in.";
    if (userInfo) {
      userContext = `USER INFO:\nName: ${userInfo.fullName}\nEmail: ${userInfo.email}`;
    }

    let orderContext = "No order information available.";
    if (userOrders && userOrders.length > 0) {
      orderContext = `RECENT ORDERS:\n${userOrders
        .map(
          (o) =>
            `- Order #${o._id.toString().slice(-6).toUpperCase()}: Status: ${o.status}, Total: $${o.totalPrice}, Date: ${o.createdAt}`
        )
        .join("\n")}`;
    }

    const systemPrompt = SYSTEM_PROMPT.replace("{productCatalog}", productCatalog)
      .replace("{userContext}", userContext)
      .replace("{orderContext}", orderContext);

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "Sorry, I couldn't process that.";
  },
};
