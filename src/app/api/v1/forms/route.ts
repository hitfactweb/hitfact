import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const forms = await prisma.form.findMany({
      include: {
        fields: { orderBy: { sortOrder: "asc" } },
        submissions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, forms });
  } catch (err: any) {
    console.error("Fetch forms error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch forms" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, status, fields } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Form title is required" }, { status: 400 });
    }

    if (!description || typeof description !== "string" || !description.trim()) {
      return NextResponse.json({ error: "Form description is required" }, { status: 400 });
    }

    if (!Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json({ error: "At least 1 form field is required" }, { status: 400 });
    }

    // Validate fields
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (!f.label || !f.label.trim()) {
        return NextResponse.json(
          { error: `Field ${i + 1} label is required` },
          { status: 400 }
        );
      }
      if (!f.fieldType) {
        return NextResponse.json(
          { error: `Field ${i + 1} type is required` },
          { status: 400 }
        );
      }
    }

    // Unique slug
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const createdForm = await prisma.form.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        slug,
        status: status || "PUBLISHED",
        fields: {
          create: fields.map((f: any, idx: number) => {
            let optionsJson: string | null = null;
            if (["SELECT", "RADIO", "CHECKBOX"].includes(f.fieldType)) {
              if (Array.isArray(f.options)) {
                optionsJson = JSON.stringify(f.options.filter(Boolean));
              } else if (typeof f.optionsJson === "string") {
                optionsJson = f.optionsJson;
              }
            }

            return {
              label: f.label.trim(),
              fieldType: f.fieldType,
              placeholder: f.placeholder?.trim() || null,
              required: Boolean(f.required),
              optionsJson,
              sortOrder: idx,
            };
          }),
        },
      },
      include: {
        fields: true,
      },
    });

    return NextResponse.json({ success: true, form: createdForm }, { status: 201 });
  } catch (err: any) {
    console.error("Create form error:", err);
    return NextResponse.json({ error: err.message || "Failed to create form" }, { status: 500 });
  }
}
