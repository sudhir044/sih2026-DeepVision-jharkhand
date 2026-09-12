import sql from "./db.js";

export const initializeDatabase = async () => {
  try {
    console.log("Initializing database tables...");

    // 1. Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'worker',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✓ 'users' table ready");

    // 2. Create training_modules table
    await sql`
      CREATE TABLE IF NOT EXISTS training_modules (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration VARCHAR(50),
        difficulty VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✓ 'training_modules' table ready");

    // 3. Create training_results table
    await sql`
      CREATE TABLE IF NOT EXISTS training_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        module_id INTEGER REFERENCES training_modules(id) ON DELETE CASCADE,
        score INTEGER NOT NULL,
        duration INTEGER DEFAULT 0,
        correct_actions INTEGER DEFAULT 0,
        wrong_actions INTEGER DEFAULT 0,
        safety_violations INTEGER DEFAULT 0,
        status VARCHAR(50) NOT NULL,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("✓ 'training_results' table ready");

    // Check if training modules already exist
    const existingModules = await sql`SELECT COUNT(*) as count FROM training_modules`;
    if (parseInt(existingModules[0].count, 10) === 0) {
      console.log("Seeding default training modules...");
      await sql`
        INSERT INTO training_modules (title, description, duration, difficulty, status)
        VALUES 
        (
          'Fire & Explosion Response',
          'AR-based industrial hazard detection, fire extinguisher selection (PASS technique), and emergency evacuation protocols.',
          '15 mins',
          'Intermediate',
          'active'
        ),
        (
          'Gas Leak & Confined Space Safety',
          'Atmospheric hazard identification, toxic gas detection, proper PPE donning, buddy-system, and rapid extraction.',
          '20 mins',
          'Advanced',
          'active'
        ),
        (
          'Mining Machinery & Proximity Awareness',
          'Heavy earth-moving machinery blind spot navigation, lockout-tagout (LOTO) basics, and conveyor safety.',
          '10 mins',
          'Beginner',
          'active'
        );
      `;
      console.log("✓ Seeded 3 default training modules");
    } else {
      console.log(`ℹ Found ${existingModules[0].count} existing training modules`);
    }

    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

// Auto-run if executed directly
if (process.argv[1]?.endsWith("init-db.js")) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
