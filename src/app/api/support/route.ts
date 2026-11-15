import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser, requireAdmin } from "@/lib/auth";
import { generateCode } from "@/lib/utils";

export async function GET() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    if (session.role === "ADMIN") {
      const tickets = await prisma.supportTicket.findMany({
        include: { user: { select: { name: true, email: true, mobile: true } } },
        orderBy: { createdAt: "desc" },
      });
      const contactMessages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ tickets, contactMessages });
    } else {
      const tickets = await prisma.supportTicket.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ tickets });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch support data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser();
  if (!session || session.role !== "CITIZEN") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { subject, category, description } = await req.json();

    if (!subject || !description) {
      return NextResponse.json({ error: "Subject and description are required." }, { status: 400 });
    }

    const ticketCode = generateCode("ECO-TCK");

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketCode,
        userId: session.id,
        subject: subject.trim(),
        category: category || "General",
        description: description.trim(),
        status: "OPEN",
      },
    });

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create support ticket." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 403 });

  try {
    const { ticketId, status, adminResponse } = await req.json();

    const updated = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: status || undefined,
        adminResponse: adminResponse || undefined,
      },
    });

    return NextResponse.json({ success: true, ticket: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update ticket." }, { status: 500 });
  }
}
