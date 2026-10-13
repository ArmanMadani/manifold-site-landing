import Image from "next/image";
import splash from "../../dune-splash-image.jpg";
import ContactForm from "../components/ContactForm";
import FadeOnLeave from "../components/FadeOnLeave";
import SiteCredit from "../components/SiteCredit";

export const metadata = {
  title: "Contact — Manifold",
  description: "Get in touch with Manifold.",
};

export default function Contact() {
  return (
    <main className="page">
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
        <div className="contact-scrim" aria-hidden="true" />

        <section className="contact">
          <h1 className="panel__title contact-pan" style={{ "--i": 0 }}>We’re excited to hear from you</h1>
          <ContactForm />
        </section>

        <footer className="page-credit">
          <SiteCredit />
        </footer>
      </FadeOnLeave>
    </main>
  );
}
