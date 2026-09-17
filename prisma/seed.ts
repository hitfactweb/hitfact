import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database and setting up initial production configuration...");

  // Purge all existing data
  await prisma.auditLog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.formSubmission.deleteMany();
  await prisma.formField.deleteMany();
  await prisma.form.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizOption.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.pollVote.deleteMany();
  await prisma.pollOption.deleteMany();
  await prisma.poll.deleteMany();
  await prisma.commentLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.save.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.factCheck.deleteMany();
  await prisma.article.deleteMany();
  await prisma.post.deleteMany();
  await prisma.category.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Initial Super Admin Account
  const superAdmin = await prisma.user.create({
    data: {
      id: "usr_admin",
      email: "admin@hitfact.com",
      name: "Chief Editor (Admin)",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      profile: {
        create: {
          username: "admin",
          displayName: "Editorial Board",
          bio: "HITFACT Editorial Administration and Fact-Checking Desk.",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
      },
    },
  });

  // 2. Setup Standard Core Desks / Categories
  await prisma.category.createMany({
    data: [
      { name: "Politics", slug: "politics", description: "Governance, legislation, electoral policy, and public accountability.", color: "#ED1C24", sortOrder: 1 },
      { name: "Media", slug: "media", description: "Press freedom, algorithm transparency, and media narratives.", color: "#3B82F6", sortOrder: 2 },
      { name: "Reality Check", slug: "reality-check", description: "Direct debunking, viral claims, and statistical reality.", color: "#10B981", sortOrder: 3 },
      { name: "Economy", slug: "economy", description: "Inflation, fiscal analysis, taxation, and labor data.", color: "#F59E0B", sortOrder: 4 },
      { name: "Science & AI", slug: "science-ai", description: "Emerging technology, artificial intelligence, and scientific data.", color: "#8B5CF6", sortOrder: 5 },
    ],
  });

  console.log("Database successfully cleaned. Initial Super Admin and Categories created.");
}

main()
  .catch((e) => {
    console.error("Clean error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
