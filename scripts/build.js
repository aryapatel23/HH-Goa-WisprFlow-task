const { execSync } = require("child_process");

console.log("🚀 Starting MassMatter Vercel/Production build pipeline...");

// 1. Conditionally run Prisma Migration Deploy if flag is set
const shouldMigrate =
  process.env.MIGRATE_DEPLOY_BEFORE_NEXT_JS_BUILD === "true" ||
  process.env.MIGRATE_DEPLOY_BEFORE_NEXT_JS_BUILD === "1";

if (shouldMigrate) {
  console.log("📦 MIGRATE_DEPLOY_BEFORE_NEXT_JS_BUILD detected. Running prisma migrate deploy...");
  try {
    execSync("npx prisma migrate deploy", { stdio: "inherit" });
    console.log("✅ Database schema migrations deployed successfully.");
  } catch (err) {
    console.error("⚠️ Migration deployment failed:", err.message);
    process.exit(1);
  }
} else {
  console.log(
    "ℹ️ Skipping prisma migrate deploy (MIGRATE_DEPLOY_BEFORE_NEXT_JS_BUILD is false or unset)."
  );
}

// 2. Generate Prisma Client
console.log("🔧 Generating fresh Prisma Client...");
try {
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("✅ Prisma Client generated.");
} catch (err) {
  const errStr = `${err.message || ""} ${err.stderr?.toString() || ""} ${err.stdout?.toString() || ""}`;
  if (
    process.platform === "win32" &&
    (errStr.includes("EPERM") || errStr.includes("EBUSY") || err.status !== 0)
  ) {
    console.warn("⚠️ Prisma client DLL locked by active dev process on Windows. Proceeding with existing client...");
  } else {
    console.error("❌ Prisma generate failed:", err.message);
    process.exit(1);
  }
}

// 3. Run Next.js Production Build
console.log("⚡ Compiling Next.js application (next build)...");
try {
  execSync("next build", { stdio: "inherit" });
  console.log("🎉 MassMatter build completed successfully!");
} catch (err) {
  console.error("❌ Next.js build failed:", err.message);
  process.exit(1);
}
