import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { optionId, userId } = await req.json();
    const pollId = params.id;

    if (!optionId) {
      return NextResponse.json({ error: "optionId is required" }, { status: 400 });
    }

    // Check if voter provided a valid registered user id
    let verifiedUserId: string | null = null;
    const voterKey = userId || "anonymous_voter";

    if (userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (userExists) {
        verifiedUserId = userId;
      }
    }

    // Duplicate detection
    const existing = await prisma.pollVote.findFirst({
      where: {
        pollId,
        OR: [
          ...(verifiedUserId ? [{ userId: verifiedUserId }] : []),
          { voterKey },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Duplicate vote: You have already cast a ballot in this poll." },
        { status: 409 }
      );
    }

    // Record vote
    const vote = await prisma.pollVote.create({
      data: {
        pollId,
        optionId,
        userId: verifiedUserId,
        voterKey,
      },
    });

    return NextResponse.json({ success: true, vote });
  } catch (err: any) {
    console.error("Poll vote error:", err);
    return NextResponse.json({ error: err.message || "Failed to record vote" }, { status: 500 });
  }
}
