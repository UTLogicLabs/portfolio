export function readTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200));
}
