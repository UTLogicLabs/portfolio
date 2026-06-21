import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("about", "routes/about.tsx"),
  route("blog", "routes/blog._index.tsx"),
  layout("routes/blog.tsx", [
    route("blog/:slug", "routes/blog.$slug.tsx"),
  ]),
  route("projects", "routes/projects._index.tsx"),
  route("projects/:slug", "routes/projects.$slug.tsx"),
  route("contact", "routes/contact.tsx"),
] satisfies RouteConfig;
