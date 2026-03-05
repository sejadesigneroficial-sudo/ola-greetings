import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { User, Phone, Mail, MapPin } from "lucide-react";

export default function Edital() {
  const { siteSettings } = useData();
  const edital = siteSettings?.edital;

  return (
    <>
      <Helmet>
        <title>Edital do Leilão | arremate24h</title>
        <meta name="description" content="Leia o edital completo dos leilões da arremate24h. Condições de participação, pagamento, retirada e garantias." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Edital do Leilão
            </h1>
            <p className="text-xl text-primary-foreground/80 mx-auto">
              Condições gerais de participação nos leilões da arremate24h
            </p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Auctioneer Info */}
            <Card className="mb-8 border-gold/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl">Leiloeiro Oficial</h2>
                    <p className="text-muted-foreground">{edital?.auctioneerName || "arremate24h"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{siteSettings.phone || "(47) 3311-0550"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{siteSettings.email || "contato@arremate24h.com.br"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{siteSettings.address || "Joinville, SC"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edital Text */}
            <Card>
              <CardContent className="p-6 lg:p-8">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <h3 className="text-foreground font-display font-bold text-lg mb-4">1. CONDIÇÕES GERAIS</h3>
                  <p className="mb-4">
                    {edital?.condicoesGerais || "Os leilões são realizados de forma online, através da plataforma arremate24h. A participação é livre para pessoas físicas maiores de 18 anos e pessoas jurídicas regularmente constituídas. É obrigatório o cadastro prévio na plataforma para participar dos leilões. O cadastro implica na aceitação integral deste edital e das condições de venda."}
                  </p>

                  <h3 className="text-foreground font-display font-bold text-lg mb-4 mt-6">2. HABILITAÇÃO</h3>
                  <p className="mb-4">
                    {edital?.habilitacao || "Para participar, o interessado deve realizar seu cadastro completo na plataforma. Documentos necessários: CPF/CNPJ, RG, comprovante de residência e dados bancários. A aprovação do cadastro será realizada em até 24 horas úteis. A arremate24h reserva-se o direito de recusar cadastros incompletos ou com inconsistências."}
                  </p>

                  <h3 className="text-foreground font-display font-bold text-lg mb-4 mt-6">3. LANCES E ARREMATAÇÃO</h3>
                  <p className="mb-4">
                    {edital?.lancesArrematacao || "Os lances são registrados em tempo real e são irrevogáveis e irretratáveis. O maior lance ao final do tempo estipulado será considerado o vencedor. Em caso de empate no último segundo, prevalece o lance registrado primeiro. A desistência após a arrematação implicará em multa de 20% do valor do lance."}
                  </p>

                  <h3 className="text-foreground font-display font-bold text-lg mb-4 mt-6">4. PAGAMENTO</h3>
                  <p className="mb-4">
                    {edital?.pagamento || "O pagamento deve ser realizado em até 48 horas após a arrematação."} Formas aceitas: {edital?.paymentMethods || "PIX, transferência bancária ou boleto bancário"}. A comissão do leiloeiro é de {edital?.commissionRate || 5}% sobre o valor da arrematação. Taxa administrativa de {edital?.adminFee || 2}% será adicionada ao valor final.
                  </p>

                  <h3 className="text-foreground font-display font-bold text-lg mb-4 mt-6">5. RETIRADA DOS BENS</h3>
                  <p className="mb-4">
                    {edital?.retiradaBens || `A retirada deve ser agendada e realizada em até ${edital?.pickupDeadline || 10} dias úteis após confirmação do pagamento. O arrematante é responsável pelo transporte dos bens arrematados. A arremate24h pode indicar transportadoras parceiras mediante solicitação. Bens não retirados no prazo estarão sujeitos a cobrança de estadia.`}
                  </p>

                  <h3 className="text-foreground font-display font-bold text-lg mb-4 mt-6">6. GARANTIAS E RESPONSABILIDADES</h3>
                  <p className="mb-4">
                    {edital?.garantias || "Os bens são vendidos no estado em que se encontram (ad corpus). É recomendada a vistoria prévia dos lotes antes de efetuar lances. A arremate24h não se responsabiliza por vícios ocultos ou aparentes. Fotos e descrições são meramente ilustrativas."}
                  </p>

                  <h3 className="text-foreground font-display font-bold text-lg mb-4 mt-6">7. DISPOSIÇÕES FINAIS</h3>
                  <p className="mb-4">
                    {edital?.disposicoesFinais || "Os casos omissos neste edital serão resolvidos pela administração da arremate24h. Ao participar do leilão, o arrematante declara ter lido e aceito integralmente todas as condições estabelecidas neste edital. Este edital poderá ser alterado a qualquer momento, ficando as alterações disponíveis na plataforma."}
                  </p>

                  {edital?.visitSchedule && (
                    <>
                      <h3 className="text-foreground font-display font-bold text-lg mb-4 mt-6">8. VISITAÇÃO</h3>
                      <p className="mb-4">
                        Horário de visitação dos lotes: {edital.visitSchedule}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}