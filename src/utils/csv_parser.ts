import fs from "fs";
import readline from "readline";

interface ParsedRow {
  [key: string]: any;
}

/**
 * Reads and parses a CSV file into an array of row objects.
 * - Uses Node's file system to create a readable stream of the CSV file.
 * - Uses readline to process the file line by line.
 * - Maps rows into key-value objects based on headers.
 */
export async function parseCSV (filePath: string): Promise<ParsedRow[]> {
  const fileStream = fs.createReadStream(filePath);
  const rl  = readline.createInterface({ input: fileStream, crlfDelay: Infinity});

  const rows: ParsedRow[] = [];
  let headers: string[] = [];

  for await (const line of rl) {
    const values = line.split(",").map((v: string) => v.trim());

    // If headers are not set, assign the first line as headers
    if(!headers.length) {
      headers = values;
      continue;
    }

    // Map values to the corresponding headers
    const obj: ParsedRow = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || ""
    });

    rows.push(obj);
  }
  return rows;
}