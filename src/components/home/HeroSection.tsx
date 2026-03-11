import { ChevronLeft, ChevronRight, CreditCard, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const LOCATION_URL = "https://www.google.com/maps/@-19.9780792,-44.2565275,3a,90y,334.85h,70.68t/data=!3m7!1e1!3m5!1sukNckXhiNoN1yRcEMl3FjQ!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D19.319999999999993%26panoid%3DukNckXhiNoN1yRcEMl3FjQ%26yaw%3D334.85!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI2MDIwMy4wIKXMDSoASAFQAw%3D%3D";

export function HeroSection() {
  const { banners, siteSettings } = useData();
  const activeBanners = banners.filter(b => b.is_active);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const banner = activeBanners[currentBanner] || activeBanners[0];

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);

  if (!banner) return null;

  return (
    <section className="relative">
      {/* Background Image */}
      <div className="relative h-[320px] md:h-[380px] overflow-hidden">
        <img
          src={banner.image_url || heroBg}
          alt="Carros e motos em leilão"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/50 to-transparent" />

        {/* Content - Action Buttons */}
        <div className="absolute inset-0 flex items-end pb-14 md:pb-16">
          <div className="container mx-auto px-4 flex gap-2 sm:gap-3 justify-center items-center">
            <button
              onClick={() => {
                const link = siteSettings?.financing_link || 'https://financiamento-bv.lovable.app/simular-agora';
                window.open(link, '_blank');
              }}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold rounded-[5px] bg-accent text-accent-foreground shadow-lg hover:shadow-xl hover:brightness-110 active:scale-[0.97] transition-all duration-200"
            >
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Financiamento
            </button>
            <button
              onClick={() => window.open(LOCATION_URL, '_blank')}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold rounded-[5px] border border-white/50 bg-black/30 text-white backdrop-blur-md shadow-lg hover:bg-black/50 active:scale-[0.97] transition-all duration-200"
            >
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Localização
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={prevBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-2 h-2 rounded-lg transition-all ${
                  index === currentBanner ? "bg-gold w-6" : "bg-background/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight Bar */}
      <div className="bg-primary py-3">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary-foreground font-bold">{banner.title}</span>{" "}
          <span className="text-primary-foreground/80">{banner.highlight_text}</span>
        </div>
      </div>
    </section>
  );
}
