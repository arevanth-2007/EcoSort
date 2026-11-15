import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { NotificationType } from "@prisma/client";

export const dynamic = "force-dynamic";

const VALID_TYPES = [
  "GENERAL_ANNOUNCEMENT",
  "IMPORTANT",
  "ACCOUNT",
  "ECOSORT_UPDATE",
  "REWARD",
  "SYSTEM_ANNOUNCEMENT",
];

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const body = await req.json();
    const { title, message, type = "GENERAL_ANNOUNCEMENT", targetAudience, recipientId, link } = body;

    if (!title || typeof title !== "string" || title.trim().length < 3 || title.trim().length > 120) {
      return NextResponse.json(
        { error: "Notification title must be between 3 and 120 characters." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5 || message.trim().length > 2000) {
      return NextResponse.json(
        { error: "Notification message must be between 5 and 2000 characters." },
        { status: 400 }
      );
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid notification type selected." }, { status: 400 });
    }

    const cleanTitle = title.trim();
    const cleanMessage = message.trim();
    const cleanLink = link ? String(link).trim() : null;

    if (targetAudience === "INDIVIDUAL") {
      if (!recipientId) {
        return NextResponse.json(
          { error: "A recipient citizen must be selected for individual notifications." },
          { status: 400 }
        );
      }

      const recipient = await prisma.user.findUnique({
        where: { id: recipientId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          citizenId: true,
          status: true,
        },
      });

      if (!recipient) {
        return NextResponse.json({ error: "Selected recipient does not exist." }, { status: 404 });
      }

      if (recipient.role === "ADMIN") {
        return NextResponse.json(
          { error: "Citizen notification system cannot send messages to administrator accounts." },
          { status: 400 }
        );
      }

      const result = await prisma.$transaction(async (tx) => {
        const campaign = await tx.adminNotificationCampaign.create({
          data: {
            title: cleanTitle,
            message: cleanMessage,
            type: type as NotificationType,
            targetAudience: "INDIVIDUAL",
            recipientCount: 1,
            recipientId: recipient.id,
            recipientName: recipient.name,
            recipientEmail: recipient.email,
            recipientCitizenId: recipient.citizenId,
            sentById: session.id,
            status: "SENT",
          },
        });

        const notification = await tx.notification.create({
          data: {
            userId: recipient.id,
            title: cleanTitle,
            message: cleanMessage,
            type: type as NotificationType,
            link: cleanLink,
            isRead: false,
          },
        });

        await tx.auditLog.create({
          data: {
            adminId: session.id,
            adminEmail: session.email,
            action: "NOTIFICATION_SENT_INDIVIDUAL",
            details: `Admin ${session.name} sent notification '${cleanTitle}' to citizen ${recipient.name} (${recipient.citizenId || recipient.email})`,
            ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
          },
        });

        return { campaign, notification };
      });

      return NextResponse.json({
        success: true,
        count: 1,
        message: `Notification successfully sent to ${recipient.name} (${recipient.citizenId || "Citizen"}).`,
        campaign: result.campaign,
      });
    } else if (targetAudience === "ALL_CITIZENS") {
      // Fetch all active citizens (strictly excluding ADMINs)
      const citizens = await prisma.user.findMany({
        where: {
          role: "CITIZEN",
          status: "ACTIVE",
        },
        select: { id: true, name: true, email: true },
      });

      if (citizens.length === 0) {
        return NextResponse.json(
          { error: "No active citizens found to receive this broadcast." },
          { status: 400 }
        );
      }

      // Execute atomic bulk delivery
      const result = await prisma.$transaction(async (tx) => {
        const campaign = await tx.adminNotificationCampaign.create({
          data: {
            title: cleanTitle,
            message: cleanMessage,
            type: type as NotificationType,
            targetAudience: "ALL_CITIZENS",
            recipientCount: citizens.length,
            sentById: session.id,
            status: "SENT",
          },
        });

        // Bulk insert notifications for all citizens
        await tx.notification.createMany({
          data: citizens.map((c) => ({
            userId: c.id,
            title: cleanTitle,
            message: cleanMessage,
            type: type as NotificationType,
            link: cleanLink,
            isRead: false,
          })),
        });

        await tx.auditLog.create({
          data: {
            adminId: session.id,
            adminEmail: session.email,
            action: "NOTIFICATION_BROADCAST_ALL",
            details: `Admin ${session.name} broadcasted '${cleanTitle}' to all ${citizens.length} registered citizens.`,
            ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
          },
        });

        return campaign;
      });

      return NextResponse.json({
        success: true,
        count: citizens.length,
        message: `Notification broadcast successfully dispatched to all ${citizens.length} registered citizens.`,
        campaign: result,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid target audience. Choose 'ALL_CITIZENS' or 'INDIVIDUAL'." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Admin notification dispatch error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch notification: " + (error?.message || "Internal error") },
      { status: 500 }
    );
  }
}
