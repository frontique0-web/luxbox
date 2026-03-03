import { execSync } from "child_process";
import fs from "fs";

function log(msg: string) {
    console.log(`[Vercel Build] ${msg}`);
}

async function runBuild() {
    log("Starting safe Vercel build...");

    // 1. Check for database connection
    if (!process.env.DATABASE_URL) {
        log("⚠️ WARNING: DATABASE_URL environment variable is missing!");
        log("⚠️ Skipping database push and seed. Please add DATABASE_URL in the Vercel dashboard and redeploy to enable the database.");
    } else {
        log("✅ DATABASE_URL found. Running database migrations...");
        try {
            execSync("npm run db:push", { stdio: "inherit" });
            log("✅ Database pushed successfully.");

            log("Running database seed...");
            execSync("npm run db:seed", { stdio: "inherit" });
            log("✅ Database seeded successfully.");
        } catch (e: any) {
            log(`❌ ERROR during database operations: ${e.message}`);
            log("⚠️ Continuing build despite database errors so the frontend can deploy...");
        }
    }

    // 2. Run the main build
    log("Running main application build (vite & esbuild)...");
    try {
        execSync("npm run build", { stdio: "inherit" });
        log("✅ Main build completed successfully.");
    } catch (e: any) {
        log(`❌ ERROR during main build: ${e.message}`);
        process.exit(1);
    }
}

runBuild().catch(console.error);
