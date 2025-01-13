import exp from "constants";
import express from "express";
import product from "./product";
import category from "./category";

const router = express.Router();

export default (): express.Router => {
  product(router);
  category(router);
  return router;
};
