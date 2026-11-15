import prisma from "@/lib/db";

export function extractCitizenNamePrefix(fullName: string): string {
  if (!fullName) return "CIT";

  const words = fullName
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[^A-Za-z]/g, "").toUpperCase())
    .filter((w) => w.length > 0);

  if (words.length === 0) return "CIT";

  const revMatch = words.find((w) => w.startsWith("REV"));
  if (revMatch) return "REV";

  const validWord = words.find((w) => w.length >= 3) || words[0];
  return validWord.slice(0, 3).padEnd(3, "X").toUpperCase();
}

export async function generateUniqueCitizenId(fullName: string, dbClient: any = prisma): Promise<string> {
  const prefix = extractCitizenNamePrefix(fullName);
  const maxAttempts = 20;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const digits = Math.floor(100000 + Math.random() * 900000).toString();
    const candidateId = `ECO-${prefix}-${digits}`;

    const existing = await dbClient.user.findUnique({
      where: { citizenId: candidateId },
      select: { id: true },
    });

    if (!existing) {
      return candidateId;
    }
  }

  // Fallback with high-entropy timestamp component
  const fallbackDigits = (Math.floor(Date.now() + Math.random() * 10000) % 900000 + 100000).toString();
  return `ECO-${prefix}-${fallbackDigits}`;
}
