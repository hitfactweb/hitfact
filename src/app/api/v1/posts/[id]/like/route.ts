import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await req.json();

    let validUserId = userId;
    if (!validUserId) {
      const defaultUser = await prisma.user.findFirst();
      validUserId = defaultUser?.id || "usr_reader";
    }

    // Toggle like
    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: validUserId,
          postId: params.id,
        },
      },
    });

    if (existing) {
      await prisma.like.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, liked: false });
    } else {
      await prisma.like.create({
        data: {
          userId: validUserId,
          postId: params.id,
        },
      });
      return NextResponse.json({ success: true, liked: true });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to toggle like" }, { status: 500 });
  }
}
