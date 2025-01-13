import CategoryModel from "../db/category";

import express from "express";

// export const getProducts = async (req: Request, res: Response) => {};

const addCategory = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    console.log("category hit");
    const { name } = req.body;

    // validate req body ..
    if (!name) {
      res.status(400).json({ message: "Please fill all required fields" });
      return;
    }

    // Validate category
    const existingCategory = await CategoryModel.findOne({ name: name.trim() });
    if (existingCategory) {
      res.status(400).json({ error: "Category already exist" });
      return;
    }

    const category = new CategoryModel({
      name,
    });

    await category.save();

    res
      .status(201)
      .json({ message: "Category created successfully", category });
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

const getAllCategory = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  // asyncHandler(
  try {
    const Categories = await CategoryModel.find({});
    res.json(Categories);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
        code: 500,
      },
    });
  }
  // )
};

export { addCategory, getAllCategory };
