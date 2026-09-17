import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const MASTER_ADMIN_PASSWORDS = [
  "HitFact@2026#Secured!Key",
  process.env.ADMIN_PASSWORD || "HitFact@2026#Secured!Key",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const userAgent = req.headers.get("user-agent") || "Unknown Device / Browser";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Staff Email and Password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Check Brute-Force Rate Limiting (5 failed attempts within 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentFailures = await prisma.auditLog.count({
      where: {
        action: "LOGIN_FAILED",
        targetId: clientIp,
        createdAt: { gte: fifteenMinutesAgo },
      },
    });

    if (recentFailures >= 5) {
      // Record lockout event
      await prisma.auditLog.create({
        data: {
          action: "LOGIN_BLOCKED",
          actorId: cleanEmail,
          targetType: "AUTH",
          targetId: clientIp,
          metadata: JSON.stringify({
            ip: clientIp,
            userAgent,
            reason: "Too many failed attempts. Temporary 15-minute lockout enforced.",
            failureCount: recentFailures,
          }),
        },
      });

      return NextResponse.json(
        {
          error:
            "Security Lockout: Too many failed login attempts. Your IP has been temporarily locked for 15 minutes to protect against brute-force attacks.",
        },
        { status: 429 }
      );
    }

    // 2. Validate Credentials
    const isAdminEmail = cleanEmail === "admin@hitfact.com" || cleanEmail === "admin";
    const isPasswordValid = MASTER_ADMIN_PASSWORDS.includes(cleanPassword);

    if (isAdminEmail && isPasswordValid) {
      // Record successful login in Audit Log
      await prisma.auditLog.create({
        data: {
          action: "LOGIN_SUCCESS",
          actorId: "admin@hitfact.com",
          targetType: "AUTH",
          targetId: clientIp,
          metadata: JSON.stringify({
            ip: clientIp,
            userAgent,
            role: "SUPER_ADMIN",
            status: "SUCCESS",
            loginTime: new Date().toISOString(),
          }),
        },
      });

      const adminUser = {
        id: "usr_admin",
        name: "Chief Editor (Admin)",
        email: "admin@hitfact.com",
        role: "SUPER_ADMIN" as const,
        username: "admin",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      };

      return NextResponse.json({ success: true, user: adminUser }, { status: 200 });
    }

    // 3. Failed attempt: Record failure in Audit Log
    await prisma.auditLog.create({
      data: {
        action: "LOGIN_FAILED",
        actorId: cleanEmail,
        targetType: "AUTH",
        targetId: clientIp,
        metadata: JSON.stringify({
          ip: clientIp,
          userAgent,
          attemptedEmail: cleanEmail,
          reason: "Invalid Credentials",
          attemptNumber: recentFailures + 1,
        }),
      },
    });

    const remaining = Math.max(0, 4 - recentFailures);
    return NextResponse.json(
      {
        error: `Invalid credentials. ${remaining} attempt(s) remaining before temporary security lockout.`,
      },
      { status: 401 }
    );
  } catch (err: any) {
    console.error("Auth login error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
