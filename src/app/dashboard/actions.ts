"use server";

import { createDeployment } from "@/lib/db/deployments";
import { generateKairosInsight } from "@/lib/ai/kairos";
import { revalidatePath } from "next/cache";

export async function addDeploymentAction(formData: FormData, userId: string) {
  const title = formData.get("title") as string;
  const amount = Number(formData.get("amount"));

  if (!title || isNaN(amount)) {
    throw new Error("Invalid input");
  }

  await createDeployment(title, amount, userId);

  const insight = generateKairosInsight({ title, amount });

  revalidatePath("/dashboard");

  return { insight };
}
