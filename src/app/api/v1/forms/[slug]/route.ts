import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const identifier = params.slug;
    const form = await prisma.form.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        fields: {
          orderBy: { sortOrder: "asc" },
        },
        submissions: true,
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, form });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch form" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const identifier = params.slug;
    const body = await req.json();
    const { answers, userId } = body;

    const form = await prisma.form.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.status === "CLOSED") {
      return NextResponse.json(
        { error: "This civic survey is currently closed to new responses." },
        { status: 400 }
      );
    }

    const submission = await prisma.formSubmission.create({
      data: {
        formId: form.id,
        userId: userId || null,
        answersJson: JSON.stringify(answers || {}),
      },
    });

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (err: any) {
    console.error("Submit form error:", err);
    return NextResponse.json({ error: err.message || "Failed to record submission" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const identifier = params.slug;

    const form = await prisma.form.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    await prisma.form.delete({
      where: { id: form.id },
    });

    return NextResponse.json({ success: true, message: "Form deleted successfully" });
  } catch (err: any) {
    console.error("Delete form error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete form" }, { status: 500 });
  }
}
