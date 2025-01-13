import express from "express";

import {
  addProduct,
  getAllProducts,
  getFilteredProducts,
  updateProduct,
} from "../controllers/productController";

export default (router: express.Router) => {
  router.get("/get-products", getAllProducts);
  router.post("/add-product", addProduct);
  router.patch("/update-product/:productId", updateProduct);
  router.get("/products", getFilteredProducts);

  return router;
};
