import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const FOOTER_LINKS = {
  Layanan: [
    { label: "Art Commission", to: "/explore?category=art-commission" },
    { label: "Live2D Rigging", to: "/explore?category=live2d-rigging" },
    { label: "Copywriting", to: "/explore?category=copywriting" },
    { label: "Video Editing", to: "/explore?category=video-editing" },
    { label: "Graphic Design", to: "/explore?category=graphic-design" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", to: "/about" },
    { label: "FAQ", to: "/faq" },
    { label: "Kontak", to: "/contact" },
  ],
  Bergabung: [
    { label: "Jadi Freelancer", to: "/become-freelancer" },
    { label: "Login", to: "/login" },
    { label: "Register", to: "/register" },
  ],
};

function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                A
              </div>
              <span className="text-lg font-semibold text-ink">Artifex</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Marketplace digital yang menghubungkan kamu dengan freelancer
              berkualitas untuk setiap kebutuhan kreatif.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-ink">{title}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink/60 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs text-ink/50">
            &copy; {new Date().getFullYear()} Artifex. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-ink/50">
            Dibuat dengan <Heart className="h-3 w-3 fill-red-400 text-red-400" /> di Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
