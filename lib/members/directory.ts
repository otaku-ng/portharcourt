import {
  CREATOR_TYPE_OPTIONS,
  INTEREST_OPTIONS,
} from "@/lib/profiles/validation";
import type {
  MemberCreatorFilter,
  MemberInterest,
} from "@/lib/members/repository";

export type MemberDirectoryParams = {
  q?: string;
  interest?: MemberInterest;
  creator?: MemberCreatorFilter;
  page: number;
};

function firstValue(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  return value?.[0] ?? "";
}

function parsePositivePage(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function parseMemberDirectoryParams(
  searchParams: Record<string, string | string[] | undefined>,
): MemberDirectoryParams {
  const q = firstValue(searchParams.q).trim().slice(0, 80);
  const interestValue = firstValue(searchParams.interest);
  const creatorValue = firstValue(searchParams.creator);

  return {
    ...(q ? { q } : {}),
    ...(INTEREST_OPTIONS.includes(interestValue as MemberInterest) ? { interest: interestValue as MemberInterest } : {}),
    ...(creatorValue === "all" || CREATOR_TYPE_OPTIONS.includes(creatorValue as (typeof CREATOR_TYPE_OPTIONS)[number])
      ? { creator: creatorValue as MemberCreatorFilter }
      : {}),
    page: parsePositivePage(firstValue(searchParams.page)),
  };
}

export function memberDirectoryHref(
  filters: Omit<MemberDirectoryParams, "page"> & { page?: number },
): string {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.interest) params.set("interest", filters.interest);
  if (filters.creator) params.set("creator", filters.creator);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  const query = params.toString();
  return query ? `/community/members?${query}` : "/community/members";
}
