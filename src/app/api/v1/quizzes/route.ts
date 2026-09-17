import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: {
          include: { options: true },
          orderBy: { sortOrder: "asc" },
        },
        attempts: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, quizzes });
  } catch (err: any) {
    console.error("Fetch quizzes error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch quizzes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, timeLimit, passMark, published, questions } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Quiz title is required" }, { status: 400 });
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json({ error: "Quiz description is required" }, { status: 400 });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "At least 1 quiz question is required" }, { status: 400 });
    }

    // Validate each question and its options
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.question.trim()) {
        return NextResponse.json(
          { error: `Question ${i + 1} text is required` },
          { status: 400 }
        );
      }
      if (!q.explanation || !q.explanation.trim()) {
        return NextResponse.json(
          { error: `Question ${i + 1} requires a forensic explanation` },
          { status: 400 }
        );
      }
      if (!Array.isArray(q.options) || q.options.length < 2) {
        return NextResponse.json(
          { error: `Question ${i + 1} must have at least 2 answer choices` },
          { status: 400 }
        );
      }

      const hasCorrect = q.options.some((opt: any) => Boolean(opt.isCorrect));
      if (!hasCorrect) {
        return NextResponse.json(
          { error: `Question ${i + 1} must have at least one correct option selected` },
          { status: 400 }
        );
      }
    }

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const createdQuiz = await prisma.quiz.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        slug,
        timeLimit: timeLimit ? Number(timeLimit) : null,
        passMark: passMark !== undefined ? Number(passMark) : 70,
        published: published !== undefined ? Boolean(published) : true,
        questions: {
          create: questions.map((q: any, qIdx: number) => ({
            question: q.question.trim(),
            explanation: q.explanation.trim(),
            sortOrder: qIdx,
            options: {
              create: q.options
                .filter((o: any) => (o?.label || "").trim().length > 0)
                .map((o: any) => ({
                  label: o.label.trim(),
                  isCorrect: Boolean(o.isCorrect),
                })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    return NextResponse.json({ success: true, quiz: createdQuiz }, { status: 201 });
  } catch (err: any) {
    console.error("Create quiz error:", err);
    return NextResponse.json({ error: err.message || "Failed to create quiz" }, { status: 500 });
  }
}
