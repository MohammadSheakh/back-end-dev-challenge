import { addCategory, getAllCategory } from "../controllers/categoryController";
import express from "express";

export default (router: express.Router) => {
  router.post("/add-category", addCategory);
  router.get("/get-categories", getAllCategory);
  return router;
};
