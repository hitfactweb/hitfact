import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category");

    const where: any = { status: "PUBLISHED" };
    if (type) where.type = type;
    if (category) where.category = { slug: category };

    const posts = await prisma.post.findMany({
      where,
      take: limit,
      include: {
        factCheck: true,
        article: true,
        category: true,
        author: {
          include: { profile: true },
        },
      },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      type,
      caption,
      mediaUrl,
      categoryId,
      authorId,
      status,
      // Article specific
      summary,
      bodyText,
      readingTime,
      // Fact Check specific
      claim,
      claimant,
      claimDate,
      claimSource,
      context,
      evidence,
      analysis,
      verdict,
      sources,
    } = body;

    if (!title || !type) {
      return NextResponse.json({ error: "Title and type are required" }, { status: 400 });
    }

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Fallback author
    let validAuthorId = authorId;
    if (!validAuthorId) {
      const defaultAdmin = await prisma.user.findFirst();
      validAuthorId = defaultAdmin?.id || "usr_admin";
    }

    const mediaUrls = mediaUrl ? JSON.stringify([mediaUrl]) : null;

    const post = await prisma.post.create({
      data: {
        slug,
        type,
        title,
        caption: caption || null,
        mediaUrls,
        status: status || "PUBLISHED",
        authorId: validAuthorId,
        categoryId: categoryId || null,
        publishedAt: new Date(),
        ...(type === "ARTICLE" && {
          article: {
            create: {
              summary: summary || title,
              body: bodyText || "Full investigation text pending.",
              readingTime: Number(readingTime) || 3,
            },
          },
        }),
        ...(type === "FACT_CHECK" && {
          factCheck: {
            create: {
              claim: claim || title,
              claimant: claimant || "Public Statement",
              claimDate: claimDate || "Recent",
              claimSource: claimSource || "Public media",
              context: context || null,
              evidence: evidence || "Investigative evidence reviewed.",
              analysis: analysis || "Analysis completed.",
              verdict: verdict || "UNVERIFIED",
              sourcesJson: sources ? JSON.stringify(sources) : null,
              reviewedBy: "Editorial Board",
              reviewedAt: new Date(),
            },
          },
        }),
      },
      include: {
        factCheck: true,
        article: true,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    console.error("Create post error:", err);
    return NextResponse.json({ error: err.message || "Failed to create post" }, { status: 500 });
  }
}
