import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const startTime = Date.now();

  // 1. Verify PostgreSQL Database connectivity
  let dbStatus = "disconnected";
  let dbLatencyMs = 0;
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = "connected";
  } catch (err: any) {
    dbStatus = `error: ${err?.message || "unreachable"}`;
  }

  // 2. Check dynamic environment configurations without logging sensitive keys
  const hasDbUrl = !!process.env.DATABASE_URL;
  const hasDirectUrl = !!process.env.DIRECT_URL;
  const hasAuthSecret = !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET);
  const hasAiKey = !!(
    process.env.GROQ_API_KEY ||
    process.env.XAI_API_KEY ||
    process.env.XAI_APA_KEY
  );
  const hasGoogleOAuth = !!(
    (process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID) &&
    (process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET)
  );
  const hasMigrateFlag =
    process.env.MIGRATE_DEPLOY_BEFORE_NEXT_JS_BUILD === "true" ||
    process.env.MIGRATE_DEPLOY_BEFORE_NEXT_JS_BUILD === "1";

  const isHealthy = dbStatus === "connected" && hasDbUrl && hasAuthSecret;

  const diagnostics = {
    status: isHealthy ? "healthy" : "degraded",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    responseLatencyMs: Date.now() - startTime,
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      hasPooledConnection: hasDbUrl,
      hasDirectConnection: hasDirectUrl,
    },
    services: {
      authConfigured: hasAuthSecret,
      aiProviderConfigured: hasAiKey,
      googleOAuthConfigured: hasGoogleOAuth,
      migrationDeployOnBuild: hasMigrateFlag,
    },
    environment: process.env.NODE_ENV || "development",
  };

  return NextResponse.json(diagnostics, {
    status: isHealthy ? 200 : 503,
  });
}
