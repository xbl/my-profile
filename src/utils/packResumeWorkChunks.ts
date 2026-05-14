import type { ResumeExperience } from "@/types/resume";

/** 按像素预算贪心分包；首包用 hFirst，其余包用 hRest（对应首页非 compact / 后续 compact） */
export function packWorkExperienceChunks(
  items: readonly ResumeExperience[],
  hFirst: readonly number[],
  hRest: readonly number[],
  maxFirstPx: number,
  maxRestPx: number,
): ResumeExperience[][] {
  const n = items.length;
  if (n === 0) return [];
  if (hFirst.length !== n || hRest.length !== n) {
    return fallbackChunks(items, 3);
  }
  const mf = Math.max(120, maxFirstPx);
  const mr = Math.max(120, maxRestPx);

  const out: ResumeExperience[][] = [];
  let pos = 0;
  let chunkIdx = 0;

  while (pos < n) {
    const maxH = chunkIdx === 0 ? mf : mr;
    const heights = chunkIdx === 0 ? hFirst : hRest;
    let sum = 0;
    const start = pos;
    while (pos < n && sum + heights[pos]! <= maxH) {
      sum += heights[pos]!;
      pos++;
    }
    if (pos === start) {
      pos++;
    }
    out.push(items.slice(start, pos) as ResumeExperience[]);
    chunkIdx++;
  }
  return out;
}

export function fallbackChunks(
  items: readonly ResumeExperience[],
  perPage: number,
): ResumeExperience[][] {
  const out: ResumeExperience[][] = [];
  for (let i = 0; i < items.length; i += perPage) {
    out.push(items.slice(i, i + perPage) as ResumeExperience[]);
  }
  return out.length ? out : [[]];
}
