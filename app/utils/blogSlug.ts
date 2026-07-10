export function resolvePost<T>(
  modules: Record<string, T>,
  slug: string,
  basePath = "../../content/blog"
): { canonicalSlug: string; mod: T } | undefined {
  const exactPath = `${basePath}/${slug}.mdx`;
  if (modules[exactPath]) return { canonicalSlug: slug, mod: modules[exactPath] };

  const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`/\\d{4}-\\d{2}-\\d{2}-${escaped}\\.mdx$`);
  const match = Object.entries(modules).find(([path]) => pattern.test(path));
  if (!match) return undefined;

  return { canonicalSlug: match[0].split("/").at(-1)!.replace(/\.mdx$/, ""), mod: match[1] };
}
