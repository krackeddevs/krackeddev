import { posts } from "../posts";

// Required for static export with dynamic routes
export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

