import Image from "next/image";
import Link from "next/link";
import splash from "../dune-splash-image.jpg";

// Placeholder for routes that don't exist yet (Services, Products, …)
export default function NotFound() {
  return (
    <main>
      <div className="backdrop" aria-hidden="true">
        <Image
          src={splash}
          alt=""
          fill
          sizes="100vw"
          quality={85}
          placeholder="blur"
          className="backdrop__image"
        />
      </div>
      <div className="placeholder reveal" style={{ "--i": 0 }}>
        <h1 className="panel__title">Coming soon</h1>
        <p className="panel__body">
          <Link href="/" className="panel__link">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
