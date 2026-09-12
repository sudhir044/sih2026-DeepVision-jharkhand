import sql from "./db.js";

const testDatabase = async () => {
  try {
    const result = await sql`SELECT NOW()`;

    console.log("Database connected successfully!");
    console.log("Database time:", result[0].now);
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error.message);
  }
};

testDatabase();