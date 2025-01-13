import CategoryModel from "../db/category";
import ProductModel from "../db/product";
import exp from "constants";
import express from "express";
import crypto from "crypto";
import mongoose from "mongoose";

const addProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { name, description, price, discount, image, status, category } =
      req.body;

    // Validate category
    const validCategory = await CategoryModel.findById(category);
    console.log(validCategory);
    if (!validCategory) {
      res.status(400).json({ error: "Invalid category ID" });
      return;
    }

    // validate req body ..
    if (!name || !description || !price) {
      res.status(400).json({ message: "Please fill all required fields" });
      return;
    }

    // Generate product code
    const generateProductCode = (name: string): string => {
      // Step 1: Hash the product name
      const hashedName = crypto.createHash("md5").update(name).digest("hex");

      // Step 2: Find longest strictly increasing substrings
      const findLongestIncreasingSubstrings = (str: string) => {
        const substrings: { start: number; end: number; value: string }[] = [];
        let start = 0;

        for (let i = 1; i <= str.length; i++) {
          if (
            i === str.length ||
            str[i].toLowerCase() <= str[i - 1].toLowerCase()
          ) {
            substrings.push({
              start,
              end: i - 1,
              value: str.slice(start, i),
            });
            start = i;
          }
        }

        // Find the longest length
        const maxLength = Math.max(...substrings.map((s) => s.value.length));

        // Filter substrings of the longest length
        return substrings
          .filter((s) => s.value.length === maxLength)
          .map((s) => ({
            start: s.start,
            end: s.end,
            value: s.value.toLowerCase(),
          }));
      };

      const substrings = findLongestIncreasingSubstrings(name);
      const concatenatedSubstrings = substrings.map((s) => s.value).join("");
      const startIndices = substrings.map((s) => s.start).join("");
      const endIndices = substrings.map((s) => s.end).join("");

      // Step 3: Format the product code
      return `${hashedName}-${startIndices}${concatenatedSubstrings}${endIndices}`;
    };

    // generate product code
    const productCode = generateProductCode(name);

    const existingProduct = await ProductModel.findOne({ productCode });
    if (existingProduct) {
      throw new Error("Product code must be unique");
    }

    const product = new ProductModel({
      name,
      description,
      price,
      discount,
      image,
      status,
      productCode,
      category,
    });

    await product.save();

    res.json(product);

    res.json({
      success: true,
      data: {
        product,
      },
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
        code: 500,
      },
    });
  }
};

const getAllProducts = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const Products = await ProductModel.find({});

    res.json({
      success: true,
      data: {
        Products,
      },
      message: "Products retrive successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
        code: 500,
      },
    });
  }
};

const updateProduct = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { status, description, discount } = req.body;

    const product = await ProductModel.findById(productId);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (status && !["Stock Out", "In Stock"].includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

    if (
      discount &&
      (typeof discount !== "number" || discount < 0 || discount > 100)
    ) {
      res.status(400).json({ message: "Invalid discount value" });
      return;
    }

    // Update the fields if provided
    if (status !== undefined) {
      product.status = status;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (discount !== undefined) {
      product.discount = discount;
    }

    // Save the updated product
    const updatedProduct = await product.save();

    res.json({
      success: true,
      data: {
        updatedProduct,
      },
      message: "Products updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
        code: 500,
      },
    });
  }
};

const getFilteredProducts = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { category, name } = req.query; // Extract query parameters
    const filter: { [key: string]: any } = {};

    // Validate and filter by category
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category as string)) {
        res.status(400).json({ message: "Category not found" });
        return;
      }
      filter.category = category;
    }

    // Search by name if provided (partial match, case-insensitive)
    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Case-insensitive regex search
    }

    // Fetch filtered products
    const products = await ProductModel.find(filter);

    // Calculate original and final prices
    const productsWithPricing = products.map((product) => {
      const finalPrice = product.discount
        ? product.price - (product.price * product.discount) / 100
        : product.price;

      return {
        ...product.toObject(), // Convert Mongoose document to plain object
        originalPrice: product.price,
        finalPrice,
      };
    });

    res.json({
      success: true,
      data: {
        productsWithPricing,
      },
      message: "Products retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
        code: 500,
      },
    });
  }
};

export { addProduct, getAllProducts, updateProduct, getFilteredProducts };
