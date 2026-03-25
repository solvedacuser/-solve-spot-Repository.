const MIN_LEVEL = 1;
const MAX_LEVEL = 30;
const MIN_SOLVED_COUNT = 1000;

function normalizeRangeValue(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.trunc(value)));
}

export function normalizeLevelRange(minLevel?: number, maxLevel?: number) {
  const min = normalizeRangeValue(minLevel, MIN_LEVEL);
  const max = normalizeRangeValue(maxLevel, MAX_LEVEL);

  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
  };
}

export function normalizeHandles(handles: string[]) {
  return [...new Set(handles.map((handle) => handle.trim()).filter(Boolean))];
}

export function normalizeTagKeys(tagKeys: string[] = []) {
  return [...new Set(tagKeys.map((tagKey) => tagKey.trim()).filter(Boolean))];
}

export function buildSolvedProblemQuery(handle: string, problemId: number) {
  return `id:${problemId}+s@${handle}`;
}

export function buildRecommendationQuery(input: {
  handles: string[];
  minLevel?: number;
  maxLevel?: number;
  tagKeys?: string[];
}) {
  const { min, max } = normalizeLevelRange(input.minLevel, input.maxLevel);
  const handles = normalizeHandles(input.handles);
  const tagKeys = normalizeTagKeys(input.tagKeys);
  const conditions = [`*${min}..${max}`, `s#${MIN_SOLVED_COUNT}..`, "lang:ko"];

  if (tagKeys.length > 0) {
    conditions.push(`(${tagKeys.map((tagKey) => `tag:${tagKey}`).join("|")})`);
  }

  handles.forEach((handle) => {
    conditions.push(`!s@${handle}`);
  });

  return conditions.join("+");
}

export function buildProblemUrl(problemId: number) {
  return `https://www.acmicpc.net/problem/${problemId}`;
}
