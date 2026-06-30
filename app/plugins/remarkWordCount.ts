import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";
import type { Plugin } from "unified";

export const remarkWordCount: Plugin<[], Root> = () => (tree) => {
  // Exclude yaml frontmatter nodes (parsed by remark-frontmatter) from the count
  const contentNodes = tree.children.filter((n) => n.type !== "yaml");
  const text = toString({ type: "root", children: contentNodes });
  const count = text.trim().split(/\s+/).filter(Boolean).length;

  (tree.children as unknown[]).unshift({
    type: "mdxjsEsm",
    value: `export const wordCount = ${count};`,
    data: {
      estree: {
        type: "Program",
        sourceType: "module",
        body: [
          {
            type: "ExportNamedDeclaration",
            declaration: {
              type: "VariableDeclaration",
              kind: "const",
              declarations: [
                {
                  type: "VariableDeclarator",
                  id: { type: "Identifier", name: "wordCount" },
                  init: { type: "Literal", value: count, raw: String(count) },
                },
              ],
            },
            specifiers: [],
            source: null,
          },
        ],
      },
    },
  });
};
