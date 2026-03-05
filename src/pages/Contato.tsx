import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";

const Contato = () => {
  const { siteSettings } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone",
      value: siteSettings.phone || "(47) 3311-0550",
      description: "Segunda a Sexta, 8h às 18h",
    },
    {
      icon: Mail,
      title: "E-mail",
      value: siteSettings.email || "contato@arremate24h.com.br",
      description: "Resposta em até 24h",
    },
    {
      icon: MapPin,
      title: "Endereço",
      value: siteSettings.address || "São Paulo, SP - Brasil",
      description: "",
    },
    {
      icon: Clock,
      title: "Horário",
      value: "Seg a Sex: 8h - 18h",
      description: "Sábados: 9h - 13h",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success("Mensagem enviada com sucesso!", {
        description: "Nossa equipe entrará em contato em breve.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Contato | arremate24h</title>
        <meta 
          name="description" 
          content="Entre em contato com a arremate24h. Tire suas dúvidas, solicite informações ou envie sugestões. Estamos prontos para ajudar." 
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1">
          {/* Hero */}
          <section className="bg-gradient-to-br from-forest to-forest-dark py-16 lg:py-24">
            <div className="container mx-auto px-4 text-center">
              <h1 className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Entre em Contato
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Estamos aqui para ajudar. Envie sua mensagem ou entre em contato 
                pelos nossos canais de atendimento.
              </p>
            </div>
          </section>

          {/* Contact Info Cards */}
          <section className="py-12 -mt-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {contactInfo.map((info, index) => (
                  <Card 
                    key={info.title}
                    variant="featured"
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-display font-semibold text-foreground mb-1">
                        {info.title}
                      </h3>
                      <p className="text-primary font-medium text-sm">
                        {info.value}
                      </p>
                      {info.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {info.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Form */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        Envie sua Mensagem
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Preencha o formulário abaixo
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Seu nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Assunto *</Label>
                        <Select 
                          value={formData.subject} 
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="duvidas">Dúvidas sobre leilões</SelectItem>
                            <SelectItem value="cadastro">Cadastro</SelectItem>
                            <SelectItem value="pagamento">Pagamento</SelectItem>
                            <SelectItem value="venda">Quero vender</SelectItem>
                            <SelectItem value="parceria">Parcerias</SelectItem>
                            <SelectItem value="outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Escreva sua mensagem aqui..."
                        rows={6}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      variant="gold" 
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full md:w-auto"
                    >
                      {isSubmitting ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Map / Image */}
                <div className="relative">
                  <div className="sticky top-24">
                    <div className="rounded-lg overflow-hidden shadow-xl">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1976510339097!2d-46.65390968502159!3d-23.56328868468092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1635959562440!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        className="w-full"
                      />
                    </div>
                    <Card className="mt-6">
                      <CardContent className="p-6">
                        <h3 className="font-display font-semibold text-foreground mb-2">
                          Atendimento Presencial
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Agende uma visita ao nosso escritório para tirar dúvidas 
                          pessoalmente ou conhecer nossos serviços.
                        </p>
                        <Button variant="outline" className="mt-4" size="sm">
                          Agendar Visita
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Contato;