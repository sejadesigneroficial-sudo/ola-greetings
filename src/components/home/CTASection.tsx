import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useData } from "@/contexts/DataContext";

export function CTASection() {
  const { siteSettings } = useData();
  const homepage = siteSettings?.homepage;

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-forest via-forest-dark to-earth p-8 md:p-12 lg:p-16">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-lg blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-forest-light/20 rounded-lg blur-3xl" />
          
          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gold/20 rounded-lg px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold">
                Cadastro 100% gratuito
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              {homepage?.ctaTitle || "Pronto para encontrar sua próxima máquina?"}
            </h2>

            <p className="text-lg text-primary-foreground/80 mb-8 mx-auto">
              {homepage?.ctaDescription || "Junte-se a milhares de agricultores e empresários que já encontraram as melhores oportunidades em nossa plataforma. Cadastre-se agora e comece a dar lances."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/entrar">
                  {homepage?.ctaButtonText || "Criar Minha Conta"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/como-funciona">
                  Saiba Como Funciona
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-primary-foreground/60">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Sem taxa de cadastro
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Suporte 24 horas
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Transações seguras
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}