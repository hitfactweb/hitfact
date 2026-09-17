import React from "react";
import { prisma } from "@/lib/db";
import FormsListClient from "./FormsListClient";

export const dynamic = "force-dynamic";

export default async function AdminFormsPage() {
  const forms = await prisma.form.findMany({
    include: {
      fields: { orderBy: { sortOrder: "asc" } },
      submissions: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <FormsListClient initialForms={forms} />;
}
