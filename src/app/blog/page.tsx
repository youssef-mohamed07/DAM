import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/data/blog";
import { t } from "@/lib/utils";

export default function BlogPage() {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="dam-container">
        <h1 className="font-serif text-3xl text-[#0a0a0a] sm:text-4xl md:text-5xl lg:text-6xl">
          رؤى وتحليلات
        </h1>
        <p className="mt-3 text-sm text-black/50 sm:mt-4 sm:text-base">
          نصائح استثمارية وتحليل السوق وأسلوب الحياة الفاخر
        </p>
        <div className="mt-10 grid gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="dam-card group h-full overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-xs text-gold">{t(post.category)}</p>
                  <h2 className="font-serif mt-2 text-xl text-[#0a0a0a] sm:text-2xl">
                    {t(post.title)}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-black/50">{t(post.excerpt)}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
