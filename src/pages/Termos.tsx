import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function Termos() {
  return (
    <>
      <Helmet>
        <title>Termos de Uso | arremate24h</title>
        <meta name="description" content="Leia os termos de uso da plataforma arremate24h." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-primary py-12 lg:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Termos de Uso
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
                <h2 className="font-display text-xl font-bold mb-4">1. Aceitação dos Termos</h2>
                <p className="text-muted-foreground mb-6">
                  Ao acessar e utilizar a plataforma arremate24h, você concorda em cumprir e estar vinculado aos presentes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">2. Definições</h2>
                <p className="text-muted-foreground mb-4">Para fins destes Termos de Uso, considera-se:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li><strong>Plataforma:</strong> O site e aplicativo arremate24h.</li>
                  <li><strong>Usuário:</strong> Qualquer pessoa física ou jurídica cadastrada na plataforma.</li>
                  <li><strong>Lote:</strong> Bem ou conjunto de bens disponíveis para arrematação.</li>
                  <li><strong>Arrematante:</strong> Usuário que ofertou o maior lance válido em um lote.</li>
                  <li><strong>Lance:</strong> Oferta de preço realizada pelo usuário para aquisição de um lote.</li>
                </ul>

                <h2 className="font-display text-xl font-bold mb-4">3. Cadastro e Conta</h2>
                <p className="text-muted-foreground mb-4">
                  Para participar dos leilões, o usuário deve:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li>Ser maior de 18 anos ou pessoa jurídica regularmente constituída.</li>
                  <li>Fornecer informações verdadeiras, precisas e completas no cadastro.</li>
                  <li>Manter seus dados atualizados.</li>
                  <li>Ser responsável pela segurança de sua senha e conta.</li>
                  <li>Notificar imediatamente sobre qualquer uso não autorizado de sua conta.</li>
                </ul>

                <h2 className="font-display text-xl font-bold mb-4">4. Participação nos Leilões</h2>
                <p className="text-muted-foreground mb-4">
                  Ao participar dos leilões, o usuário:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li>Declara ter lido e aceito o edital específico de cada leilão.</li>
                  <li>Reconhece que os lances são irrevogáveis e irretratáveis.</li>
                  <li>Compromete-se a honrar os lances realizados.</li>
                  <li>Assume a responsabilidade pela verificação prévia dos lotes.</li>
                </ul>

                <h2 className="font-display text-xl font-bold mb-4">5. Pagamento</h2>
                <p className="text-muted-foreground mb-6">
                  O arrematante deve efetuar o pagamento integral do valor arrematado, acrescido da comissão do leiloeiro e taxas administrativas, no prazo estipulado no edital. O não pagamento no prazo caracteriza inadimplência e pode resultar em penalidades previstas no edital e na legislação vigente.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">6. Condição dos Bens</h2>
                <p className="text-muted-foreground mb-6">
                  Os bens são vendidos no estado em que se encontram (ad corpus), sendo de responsabilidade do interessado a verificação prévia. A arremate24h não se responsabiliza por vícios aparentes ou ocultos, nem por divergências entre as características reais e as descrições apresentadas.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">7. Propriedade Intelectual</h2>
                <p className="text-muted-foreground mb-6">
                  Todo o conteúdo da plataforma, incluindo mas não limitado a textos, gráficos, logotipos, ícones, imagens e software, é de propriedade exclusiva da arremate24h ou de seus licenciadores e está protegido pelas leis de propriedade intelectual.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">8. Limitação de Responsabilidade</h2>
                <p className="text-muted-foreground mb-6">
                  A arremate24h não se responsabiliza por danos diretos, indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou impossibilidade de uso da plataforma, incluindo perdas de lucros, dados ou oportunidades de negócio.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">9. Modificações</h2>
                <p className="text-muted-foreground mb-6">
                  A arremate24h reserva-se o direito de modificar estes Termos de Uso a qualquer momento. As alterações entram em vigor imediatamente após sua publicação na plataforma. O uso continuado dos serviços após as modificações constitui aceitação dos novos termos.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">10. Lei Aplicável e Foro</h2>
                <p className="text-muted-foreground mb-6">
                  Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo, SP, para dirimir quaisquer controvérsias decorrentes destes termos.
                </p>

                <h2 className="font-display text-xl font-bold mb-4">11. Contato</h2>
                <p className="text-muted-foreground">
                  Em caso de dúvidas sobre estes Termos de Uso, entre em contato conosco através do e-mail: contato@arremate24h.com.br ou telefone: (21) 97965-4426.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
