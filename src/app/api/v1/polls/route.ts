import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          include: {
            votes: true,
          },
          orderBy: { sortOrder: "asc" },
        },
        votes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, polls });
  } catch (err: any) {
    console.error("Fetch polls error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch polls" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, description, allowMultiple, requireLogin, endsAt, options } = body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Poll question is required" }, { status: 400 });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: "At least 2 poll options are required" },
        { status: 400 }
      );
    }

    const cleanOptions = options
      .map((opt: any, index: number) => {
        const label = typeof opt === "string" ? opt.trim() : (opt?.label || "").trim();
        return { label, sortOrder: index };
      })
      .filter((opt) => opt.label.length > 0);

    if (cleanOptions.length < 2) {
      return NextResponse.json(
        { error: "Please provide at least 2 non-empty poll options" },
        { status: 400 }
      );
    }

    const poll = await prisma.poll.create({
      data: {
        question: question.trim(),
        description: description?.trim() || null,
        allowMultiple: Boolean(allowMultiple),
        requireLogin: Boolean(requireLogin),
        endsAt: endsAt ? new Date(endsAt) : null,
        options: {
          create: cleanOptions,
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json({ success: true, poll }, { status: 201 });
  } catch (err: any) {
    console.error("Create poll error:", err);
    return NextResponse.json({ error: err.message || "Failed to create poll" }, { status: 500 });
  }
}
