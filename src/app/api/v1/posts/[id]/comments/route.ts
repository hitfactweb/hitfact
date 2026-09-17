import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: params.id,
        parentId: null,
      },
      include: {
        user: { include: { profile: true } },
        replies: {
          include: { user: { include: { profile: true } } },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, comments });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { body, userId, parentId } = await req.json();

    if (!body || !body.trim()) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }

    let validUserId = userId;
    if (!validUserId) {
      const defaultUser = await prisma.user.findFirst();
      validUserId = defaultUser?.id || "usr_reader";
    }

    const comment = await prisma.comment.create({
      data: {
        postId: params.id,
        userId: validUserId,
        parentId: parentId || null,
        body: body.trim(),
      },
      include: {
        user: { include: { profile: true } },
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to add comment" }, { status: 500 });
  }
}
