"use server";

import { createDeployment } from "@/lib/db/deployments";
import { generateKairosInsight } from "@/lib/ai/kairos";
import { revalidatePath } from "next/cache";

export async function addDeploymentAction(formData: FormData, userId: string) {
  console.log("Adding deployment for user:", userId);

  const title = formData.get("title") as string;
  const amount = Number(formData.get("amount"));

  if (!title || isNaN(amount)) {
    console.error("Invalid input:", { title, amount });
    throw new Error("Invalid input");
  }

  try {
    await createDeployment(title, amount, userId);
    console.log("Deployment created successfully");
  } catch (error) {
    console.error("Database error in addDeploymentAction:", error);
    throw error;
  }

  const insight = generateKairosInsight({ title, amount });

  revalidatePath("/dashboard");

  return { insight };
}
