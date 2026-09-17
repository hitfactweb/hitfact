import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const poll = await prisma.poll.findUnique({
      where: { id: params.id },
      include: {
        options: {
          include: { votes: true },
          orderBy: { sortOrder: "asc" },
        },
        votes: true,
      },
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, poll });
  } catch (err: any) {
    console.error("Get poll error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch poll" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id;

    // Verify exists
    const existing = await prisma.poll.findUnique({
      where: { id: pollId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    await prisma.poll.delete({
      where: { id: pollId },
    });

    return NextResponse.json({ success: true, message: "Poll deleted successfully" });
  } catch (err: any) {
    console.error("Delete poll error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete poll" }, { status: 500 });
  }
}
