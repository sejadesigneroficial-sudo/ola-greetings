import { Link } from "react-router-dom";
import { 
  Gavel, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Youtube,
  Linkedin
} from "lucide-react";
import { useData } from "@/contexts/DataContext";

const defaultInstitucionalLinks = [
  { name: "Quem Somos", href: "/quem-somos" },
  { name: "Como Funciona", href: "/como-funciona" },
  { name: "Perguntas Frequentes", href: "/faq" },
  { name: "Contato", href: "/contato" },
];

const defaultLeiloesLinks = [
  { name: "Leilões Ativos", href: "/leiloes?status=ativo" },
  { name: "Próximos Leilões", href: "/leiloes?status=futuro" },
  { name: "Leilões Encerrados", href: "/leiloes?status=encerrado" },
  { name: "Edital", href: "/edital" },
];

export function Footer() {
  const { siteSettings, categories } = useData();
  const footer = siteSettings?.footer;

  // Build category links from active categories
  const categoryLinks = categories
    .filter(c => c.is_active)
    .slice(0, 4)
    .map(c => ({
      name: c.name,
      href: `/leiloes?categoria=${c.name.toLowerCase()}`
    }));

  return (
    <footer className="bg-forest text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
                <Gavel className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight">
                  arremate24h
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/80 text-sm mb-6 max-w-sm">
              {footer?.brandDescription || "A maior plataforma de leilões de máquinas agrícolas do Brasil. Conectando compradores e vendedores com segurança e transparência."}
            </p>
            <div className="flex gap-3">
              <a 
                href={siteSettings?.social_media?.facebook || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={siteSettings?.social_media?.instagram || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={siteSettings?.social_media?.youtube || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href={siteSettings?.social_media?.linkedin || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Institucional */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Institucional</h4>
            <ul className="space-y-2">
              {defaultInstitucionalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Leilões */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Leilões</h4>
            <ul className="space-y-2">
              {defaultLeiloesLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Categorias</h4>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-primary-foreground/70">
            <a href={`tel:${siteSettings?.phone?.replace(/\D/g, '')}`} className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Phone className="w-4 h-4" />
              {siteSettings?.phone || "(21) 97965-4426"}
            </a>
            <a href={`mailto:${siteSettings?.email}`} className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Mail className="w-4 h-4" />
              {siteSettings?.email || "contato@arremate24h.com.br"}
            </a>
            {siteSettings?.address && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {siteSettings.address}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-forest-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
            <p>{footer?.copyrightText || footer?.copyright || "© 2026 arremate24h. Todos os direitos reservados."}</p>
            <div className="flex gap-4">
              <Link to="/termos" className="hover:text-primary-foreground transition-colors">
                Termos de Uso
              </Link>
              <Link to="/privacidade" className="hover:text-primary-foreground transition-colors">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
