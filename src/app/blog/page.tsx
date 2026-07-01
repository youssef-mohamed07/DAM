import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/data/blog";
import { t } from "@/lib/utils";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="font-serif text-5xl text-[#0a0a0a] md:text-6xl">رؤى وتحليلات</h1>
        <p className="mt-4 text-black/50">نصائح استثمارية وتحليل السوق وأسلوب الحياة الفاخر</p>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="group overflow-hidden rounded-2xl bg-white/5">
                <div className="relative aspect-[16/10]">
                  <Image src={post.image} alt="" fill className="object-cover transition group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <p className="text-xs text-gold">{t(post.category)}</p>
                  <h2 className="font-serif mt-2 text-2xl text-[#0a0a0a]">{t(post.title)}</h2>
                  <p className="mt-2 text-sm text-black/50">{t(post.excerpt)}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
