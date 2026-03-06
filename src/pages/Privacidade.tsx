import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Privacidade() {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade | arremate24h</title>
        <meta name="description" content="Conheça nossa política de privacidade e como tratamos seus dados pessoais na plataforma arremate24h." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Política de Privacidade
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Última atualização: Janeiro de 2024
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card>
              <CardContent className="p-8 prose prose-gray max-w-none">
                <h2 className="font-display text-xl font-bold mb-4">1. Introdução</h2>
                <p className="text-muted-foreground mb-6">
                  A arremate24h está comprometida com a proteção da privacidade e dos dados pessoais de seus usuários. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                </p>

                <h2 className="font-display text-xl font-bold mb-4">2. Dados Coletados</h2>
                <p className="text-muted-foreground mb-4">Coletamos os seguintes tipos de dados:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li><strong>Dados de identificação:</strong> Nome completo, CPF/CNPJ, RG, data de nascimento.</li>
                  <li><strong>Dados de contato:</strong> Endereço, e-mail, telefone.</li>
                  <li><strong>Dados financeiros:</strong> Dados bancários para pagamento e recebimento.</li>
                  <li><strong>Dados de navegação:</strong> IP, cookies, páginas visitadas, tempo de acesso.</li>
                  <li><strong>Dados de transação:</strong> Histórico de lances, arrematações e pagamentos.</li>
                </ul>

                <h2 className="font-display text-xl font-bold mb-4">3. Finalidade do Tratamento</h2>
                <p className="text-muted-foreground mb-4">Seus dados são utilizados para:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li>Permitir o cadastro e participação nos leilões.</li>
                  <li>Processar transações e pagamentos.</li>
                  <li>Enviar comunicações sobre leilões, lances e arrematações.</li>
                  <li>Cumprir obrigações legais e regulatórias.</li>
                  <li>Melhorar nossos serviços e experiência do usuário.</li>
                  <li>Prevenir fraudes e garantir a segurança da plataforma.</li>
                </ul>

                <h2 className="font-display text-xl font-bold mb-4">4. Base Legal</h2>
                <p className="text-muted-foreground mb-6">
                  O tratamento de dados é realizado com base no consentimento do titular, execução de contrato, cumprimento de obrigação legal e legítimo interesse, conforme aplicável a cada situação e em conformidade com a LGPD.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">5. Compartilhamento de Dados</h2>
                <p className="text-muted-foreground mb-4">Seus dados podem ser compartilhados com:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li>Instituições financeiras para processamento de pagamentos.</li>
                  <li>Órgãos públicos quando exigido por lei.</li>
                  <li>Parceiros de transporte e logística (quando aplicável).</li>
                  <li>Prestadores de serviços essenciais para operação da plataforma.</li>
                </ul>

                <h2 className="font-display text-xl font-bold mb-4">6. Segurança dos Dados</h2>
                <p className="text-muted-foreground mb-6">
                  Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia, firewalls, controles de acesso e monitoramento contínuo.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">7. Cookies</h2>
                <p className="text-muted-foreground mb-6">
                  Utilizamos cookies e tecnologias similares para melhorar a experiência de navegação, personalizar conteúdo e anúncios, e analisar o tráfego do site. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">8. Direitos do Titular</h2>
                <p className="text-muted-foreground mb-4">Você tem direito a:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li>Confirmar a existência de tratamento de seus dados.</li>
                  <li>Acessar seus dados pessoais.</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                  <li>Solicitar a portabilidade dos dados.</li>
                  <li>Revogar o consentimento a qualquer momento.</li>
                </ul>

                <h2 className="font-display text-xl font-bold mb-4">9. Retenção de Dados</h2>
                <p className="text-muted-foreground mb-6">
                  Seus dados são mantidos pelo tempo necessário para cumprir as finalidades para as quais foram coletados, incluindo obrigações legais, contratuais e regulatórias. Após esse período, os dados são eliminados de forma segura.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">10. Alterações nesta Política</h2>
                <p className="text-muted-foreground mb-6">
                  Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos você sobre mudanças significativas através de aviso na plataforma ou por e-mail. Recomendamos a revisão periódica desta política.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">11. Contato e Encarregado (DPO)</h2>
                <p className="text-muted-foreground mb-4">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
                </p>
                <ul className="list-none text-muted-foreground space-y-2">
                  <li><strong>E-mail:</strong> privacidade@arremate24h.com.br</li>
                  <li><strong>Telefone:</strong> (21) 97965-4426</li>
                  <li><strong>Encarregado de Dados (DPO):</strong> dpo@arremate24h.com.br</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
