import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: { options: true },
          orderBy: { sortOrder: "asc" },
        },
        attempts: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, quiz });
  } catch (err: any) {
    console.error("Get quiz error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch quiz" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = params.id;

    const existing = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    await prisma.quiz.delete({
      where: { id: quizId },
    });

    return NextResponse.json({ success: true, message: "Quiz deleted successfully" });
  } catch (err: any) {
    console.error("Delete quiz error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete quiz" }, { status: 500 });
  }
}
