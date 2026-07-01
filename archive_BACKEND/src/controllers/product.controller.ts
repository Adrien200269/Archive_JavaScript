import { Request, Response } from "express";
import { Product } from "../models/product.model";

export const productController = {
  // POST /api/v1/products
  async addProduct(req: Request, res: Response) {
    const { name, price } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });
    }

    const product = new Product({
      name,
      price: parsedPrice,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  },

  // GET /api/v1/products
  async getProducts(_req: Request, res: Response) {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: products,
    });
  },

  // PUT /api/v1/products/:id
  async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    const { name, price } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid number",
        });
      }
      product.price = parsedPrice;
    }
    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  },

  // DELETE /api/v1/products/:id
  async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  },

  // PATCH /api/v1/products/:id/favorite
  async toggleFavorite(req: Request, res: Response) {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isFavourite = !product.isFavourite;
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product marked as ${product.isFavourite ? "favorite" : "not favorite"}`,
      data: product,
    });
  },
};
