import express from "express";

import { create, get, getAll, remove, update } from "../controllers/category";

const router = express.Router();
router.get("/categories", getAll);
router.get("/categories/:id", get);
router.post("/categories", create);
router.put("/categories/:id", update);
router.delete("/categories/:id", remove);

export default router;