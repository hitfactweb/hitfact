import React from "react";
import { prisma } from "@/lib/db";
import PollsListClient from "./PollsListClient";

export const dynamic = "force-dynamic";

export default async function AdminPollsPage() {
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

  return <PollsListClient initialPolls={polls} />;
}
