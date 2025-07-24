import { Request, Response } from "express";
import { pool } from "../config/db";

/**
 * Handles for GET /api/users
 * - Fetches all users from the `users` table in the database.
 */
export async function getUsers(req: Request, res: Response) {
  try {
    const { rows } = await pool.query(`SELECT * FROM public.users`);

    return res.status(200).json({
      success: true,
      users: rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}
