import { pool } from "../config/db";
import { parseCSV } from "../utils/csv_parser";

interface UserRecord {
  name: string;
  age: number;
  address: Record<string, any>;
  additional_info: Record<string, any>;
}

/**
 * Converts a parsed CSV row into a structured UserRecord object.
 * - Merges firstName and lastName into a single `name` field.
 * - Filters out empty values for address and additional_info.
 */
function mapRecord(row: Record<string, string>): UserRecord {
  const {
    "name.firstName": firstName,
    "name.lastName": lastName,
    age,
    ...rest
  } = row;

  const address: Record<string, any> = {};
  const additional_info: Record<string, any> = {};

  // Split remaining fields into address and additional_info
  for (const [key, value] of Object.entries(rest)) {
    const trimmedValue = value?.trim() || "";

    if (trimmedValue === "") continue; // Skip empty values

    if (key.startsWith("address.")) {
      address[key.replace("address.", "")] = value;
    } else {
      additional_info[key] = value;
    }
  }

  return {
    name: `${firstName} ${lastName}`,
    age: parseInt(age, 10),
    address,
    additional_info,
  };
}


/**
 * Reads and process the CSV file, then inserts the structured json object into the database.
 * - Parse the CSV rows into structured user objects.
 * - Truncates the `users` table to avoid duplicates
 * - Begins a transaction and inserts all the users
 * - Commits the transaction or roll back if error
 * - Finally, trigger the age distribution calculation.
 */
export async function processCSV(filePath: string) {
  const rows = await parseCSV(filePath);
  const client = await pool.connect();

  // Resetting the users table before inserting new dataset
  await client.query(`TRUNCATE TABLE public.users RESTART IDENTITY`);

  try {
    await client.query("BEGIN");

    for (const row of rows) {
      const { name, age, address, additional_info } = mapRecord(row);

      await client.query(
        `
        INSERT INTO public.users (name, age, address, additional_info)
        VALUES ($1, $2, $3, $4)`,
        [name, age, JSON.stringify(address), JSON.stringify(additional_info)]
      );
    }

    await client.query("COMMIT");
    console.log("CSV data inserted successfully!");

    await printAgeDistribution(client);
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
}

/**
 * Calculates and prints the percentage distribution of users across age groups.
 * - Groups users into different age ranges: <20, 20–40, 40–60, >60.
 * - Calculates the percentage of users in each group relative to the total.
 * - Logs the distribution to the console.
 */
async function printAgeDistribution(client: any) {
  const { rows } = await client.query(`SELECT age FROM public.users`);
  const groups = { "<20": 0, "20-40": 0, "40-60": 0, ">60": 0 };

  (rows as { age: number }[]).forEach(({ age }) => {
    if (age < 20) groups["<20"]++;
    else if (age <= 40) groups["20-40"]++;
    else if (age <= 60) groups["40-60"]++;
    else groups[">60"]++;
  });

  const total = rows.length;
  console.log("\nAge-Group % Distribution:");

  for (const [group, count] of Object.entries(groups)) {
    console.log(`${group}: ${((count / total) * 100).toFixed(2)}%`);
  }
}
