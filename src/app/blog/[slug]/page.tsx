import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/data/blog";
import { blogBodies } from "@/lib/data/blogContent";
import { t } from "@/lib/utils";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = blogBodies[slug] ?? [t(post.excerpt)];

  return (
    <article className="min-h-screen bg-white pt-24">
      <div className="relative h-[55vh]">
        <Image src={post.image} alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent" />
      </div>
      <div className="dam-container max-w-3xl py-16">
        <Link href="/blog" className="text-sm text-gold">
          ← العودة للمقالات
        </Link>
        <p className="mt-6 text-xs tracking-widest text-gold uppercase">{t(post.category)}</p>
        <h1 className="font-serif mt-4 text-4xl leading-tight text-white md:text-5xl">
          {t(post.title)}
        </h1>
        <p className="mt-3 text-white/40">{post.date}</p>
        <div className="mt-12 space-y-6 text-lg leading-[1.9] text-black/70">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
