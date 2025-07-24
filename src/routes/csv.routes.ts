import { Router } from "express";
import { uploadCSV } from "../controllers/csv.controllers";

const csvRoutes = Router();

csvRoutes.post("/process", uploadCSV);

export default csvRoutes;