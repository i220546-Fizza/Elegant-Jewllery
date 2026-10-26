import { InstagramIcon } from './Icons';
import Reveal from './Reveal';

const HANDLE = '@fizara_jewels';
const IMAGES = ['category-earrings', 'category-rings', 'category-bracelets', 'category-necklaces'];

const InstagramSection = () => (
  <section className="bg-cream py-20">
    <div className="container-luxe text-center">
      <Reveal>
        <p className="section-kicker">Follow Along</p>
        <h2 className="section-heading mt-3">{HANDLE} on Instagram</h2>
      </Reveal>
      <Reveal delay={0.1} className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {IMAGES.map((id) => (
          <a
            key={id}
            href="https://www.instagram.com/fizara_jewels?utm_source=qr&mdxt=ejNzYTFsd3NwZjl4"
            className="group relative aspect-square overflow-hidden rounded-xl bg-beige"
            aria-label="View on Instagram"
          >
            <img
              src={`/uploads/products/${id}.jpg`}
              alt="Fizara-N-Sitara on Instagram"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-brown-dark/0 text-ivory opacity-0 transition-all duration-300 group-hover:bg-brown-dark/40 group-hover:opacity-100">
              <InstagramIcon />
            </span>
          </a>
        ))}
      </Reveal>
    </div>
  </section>
);

export default InstagramSection;
