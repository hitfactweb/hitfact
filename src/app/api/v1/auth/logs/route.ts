import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        targetType: "AUTH",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    const totalLogins = await prisma.auditLog.count({
      where: {
        targetType: "AUTH",
        action: "LOGIN_SUCCESS",
      },
    });

    const failedAttempts = await prisma.auditLog.count({
      where: {
        targetType: "AUTH",
        action: "LOGIN_FAILED",
      },
    });

    const blockedAttempts = await prisma.auditLog.count({
      where: {
        targetType: "AUTH",
        action: "LOGIN_BLOCKED",
      },
    });

    // Unique IPs count
    const distinctIps = await prisma.auditLog.groupBy({
      by: ["targetId"],
      where: {
        targetType: "AUTH",
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalLogins,
        failedAttempts,
        blockedAttempts,
        uniqueIps: distinctIps.length,
      },
      logs,
    });
  } catch (error: any) {
    console.error("Failed to fetch auth logs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch security logs" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await prisma.auditLog.deleteMany({
      where: {
        targetType: "AUTH",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Security logs cleared successfully.",
    });
  } catch (error: any) {
    console.error("Failed to clear auth logs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to clear logs" },
      { status: 500 }
    );
  }
}
