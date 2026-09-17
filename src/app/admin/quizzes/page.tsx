import React from "react";
import { prisma } from "@/lib/db";
import QuizzesListClient from "./QuizzesListClient";

export const dynamic = "force-dynamic";

export default async function AdminQuizzesPage() {
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

  return <QuizzesListClient initialQuizzes={quizzes} />;
}
