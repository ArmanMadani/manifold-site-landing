import Image from "next/image";
import Link from "next/link";
import splash from "../../dune-splash-image.jpg";
import FadeOnLeave from "../components/FadeOnLeave";
import SiteCredit from "../components/SiteCredit";
import SubscribeForm from "../components/SubscribeForm";
import { POSTS, TAG_COLORS, formatDate } from "./posts";

export const metadata = {
  title: "Blog — Manifold",
  description: "Writing from Manifold on AI, economics, and financial services.",
};

export default function Blog() {
  return (
    <main>
      <div className="backdrop" aria-hidden="true">
        <Image
          src={splash}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={85}
          placeholder="blur"
          className="backdrop__image"
        />
      </div>

      <FadeOnLeave>
        <div className="blog-frost" aria-hidden="true" />

        <div className="blog">
          <h1 className="sr-only">Blog</h1>

          <ol className="post-list">
            {POSTS.map(({ slug, title, tag, date }, i) => (
              <li key={slug} className="pan-in" style={{ "--i": i }}>
                <Link href={`/blog/${slug}`} className="post-row">
                  <span className="post-row__title">{title}</span>
                  <span className="post-row__tag">
                    <span
                      className="post-row__dot"
                      style={{ background: TAG_COLORS[tag] }}
                      aria-hidden="true"
                    />
                    {tag}
                  </span>
                  <time className="post-row__date" dateTime={date}>
                    {formatDate(date)}
                  </time>
                </Link>
              </li>
            ))}
          </ol>

          <section
            className="subscribe pan-in"
            style={{ "--i": POSTS.length }}
            aria-label="Subscribe to new posts"
          >
            <SubscribeForm />
          </section>

          <footer className="blog-footer">
            <SiteCredit />
          </footer>
        </div>
      </FadeOnLeave>
    </main>
  );
}
