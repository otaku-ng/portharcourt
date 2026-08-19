import { NewsletterStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export type AdminNewsletterSubscriber = {
  id: string;
  email: string;
  status: NewsletterStatus;
  subscribedAt: Date;
};

const subscriberSelect = {
  id: true,
  email: true,
  status: true,
  subscribedAt: true,
} satisfies Prisma.NewsletterSubscriberSelect;

export async function subscribeEmail(email: string, source: string | null = null): Promise<void> {
  const now = new Date();
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, source, status: NewsletterStatus.SUBSCRIBED, subscribedAt: now, unsubscribedAt: null },
    update: { status: NewsletterStatus.SUBSCRIBED, subscribedAt: now, unsubscribedAt: null, ...(source ? { source } : {}) },
  });
}

export async function getAdminNewsletterSubscribers(): Promise<AdminNewsletterSubscriber[]> {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
    select: subscriberSelect,
  });
}

export async function getSubscribedNewsletterCount(): Promise<number> {
  return prisma.newsletterSubscriber.count({ where: { status: NewsletterStatus.SUBSCRIBED } });
}
