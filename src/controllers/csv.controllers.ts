import { Request, Response } from "express";
import { processCSV } from "../service/csv.services";

/**
 * Handles POST /api/csv/process
 * - Reads CSV file path from environment variables.
 * - Calls the service layer to parse CSV and insert into the database.
 * - Responds with success or a 500 error if processing fails.
 */
export async function uploadCSV(req: Request, res: Response) {
  try {
    const filePath = process.env.CSV_FILE_PATH!;
    await processCSV(filePath);
    res.status(200).json({ message: "CSV processed successfully!" });
  } catch (error) {
    console.log("Error in uploadCSV controller: ", error);
    res.status(500).json({ error: "Failed to process CSV" });
  }
}
