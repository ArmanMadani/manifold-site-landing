import Image from "next/image";
import splash from "../../dune-splash-image.jpg";
import ContactForm from "../components/ContactForm";

export const metadata = {
  title: "Contact — Manifold",
  description: "Get in touch with Manifold.",
};

export default function Contact() {
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

      <div className="contact-scrim" aria-hidden="true" />

      <section className="contact">
        <h1 className="panel__title contact-pan" style={{ "--i": 0 }}>We’re excited to hear from you</h1>
        <ContactForm />
      </section>
    </main>
  );
}
