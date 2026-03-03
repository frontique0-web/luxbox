import { autoSeed } from "../server/auto-seed";

autoSeed().then(() => {
    console.log("Database seeded successfully via auto-seed logic.");
    process.exit(0);
}).catch((err) => {
    console.error("Database seed failed:", err);
    process.exit(1);
});
