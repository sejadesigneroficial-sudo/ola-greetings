import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("E-mail inválido").min(1, "E-mail é obrigatório");
const passwordSchema = z.string().min(6, "Senha deve ter no mínimo 6 caracteres");

type AuthFlow = "email" | "login" | "register";

export default function ClientAuth() {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading: authLoading } = useAuthContext();
  
  const [flow, setFlow] = useState<AuthFlow>("email");
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    cpf: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const getSteps = () => {
    if (flow === "email") {
      return [{ number: 1, title: "E-mail", description: "Digite seu e-mail" }];
    }
    if (flow === "login") {
      return [
        { number: 1, title: "E-mail", description: "Digite seu e-mail" },
        { number: 2, title: "Senha", description: "Digite sua senha" },
      ];
    }
    return [
      { number: 1, title: "E-mail", description: "Digite seu e-mail" },
      { number: 2, title: "Senha", description: "Crie sua senha" },
      { number: 3, title: "Dados", description: "Complete o cadastro" },
    ];
  };

  const steps = getSteps();

  const validateEmail = () => {
    try {
      emailSchema.parse(formData.email);
      setErrors((prev) => ({ ...prev, email: "" }));
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, email: e.errors[0].message }));
      }
      return false;
    }
  };

  const validatePassword = () => {
    try {
      passwordSchema.parse(formData.password);
      if (flow === "register" && formData.password !== formData.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Senhas não conferem" }));
        return false;
      }
      setErrors((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, password: e.errors[0].message }));
      }
      return false;
    }
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    
    return !!data;
  };

  const handleCheckEmail = async () => {
    if (!validateEmail()) return;
    
    setIsCheckingEmail(true);
    
    try {
      const exists = await checkEmailExists(formData.email);
      
      if (exists) {
        setFlow("login");
        setCurrentStep(2);
      } else {
        setFlow("register");
        setCurrentStep(2);
      }
    } catch (error) {
      toast.error("Erro ao verificar e-mail. Tente novamente.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleContinueStep2 = () => {
    if (validatePassword()) {
      if (flow === "login") {
        handleLogin();
      } else {
        setCurrentStep(3);
      }
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      toast.error(error.message || "Erro ao fazer login");
      setErrors((prev) => ({ ...prev, password: "Senha incorreta" }));
    } else {
      toast.success("Login realizado com sucesso!");
      navigate("/");
    }
    
    setIsLoading(false);
  };

  const handleRegister = async () => {
    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Nome é obrigatório" }));
      return;
    }
    if (!formData.phone.trim()) {
      setErrors((prev) => ({ ...prev, phone: "Telefone é obrigatório" }));
      return;
    }
    if (!formData.cpf.trim()) {
      setErrors((prev) => ({ ...prev, cpf: "CPF é obrigatório" }));
      return;
    }

    setIsLoading(true);
    
    const { error } = await signUp(formData.email, formData.password, {
      name: formData.name,
      phone: formData.phone,
      cpf: formData.cpf,
    });
    
    if (error) {
      if (error.message?.includes("already registered")) {
        toast.error("Este e-mail já está cadastrado. Faça login.");
        setFlow("login");
        setCurrentStep(2);
      } else {
        toast.error(error.message || "Erro ao criar conta");
      }
    } else {
      toast.success("Conta criada com sucesso!");
      navigate("/");
    }
    
    setIsLoading(false);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setFlow("email");
      setCurrentStep(1);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setErrors({});
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const handleChangeEmail = () => {
    setFlow("email");
    setCurrentStep(1);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      cpf: "",
    });
    setErrors({});
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  if (authLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Entrar | arremate24h</title>
        <meta name="description" content="Acesse sua conta ou cadastre-se para participar dos leilões" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-muted/30 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto border border-border shadow-xl bg-card">
            <CardContent className="p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-display font-bold text-foreground">
                  {flow === "email" && "Bem vindo!"}
                  {flow === "login" && "Bem vindo de volta!"}
                  {flow === "register" && "Criar Conta"}
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  {flow === "email" && "Digite seu e-mail para continuar."}
                  {flow === "login" && (
                    <>
                      Identificamos sua conta. Digite sua senha para entrar.
                    </>
                  )}
                  {flow === "register" && (
                    <>
                      Não encontramos uma conta com este e-mail. Crie sua conta agora!
                    </>
                  )}
                </p>
              </div>

              {/* Stepper */}
              <div className="flex items-center justify-center mb-6">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          currentStep > step.number
                            ? "bg-success text-success-foreground"
                            : currentStep === step.number
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {currentStep > step.number ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          step.number
                        )}
                      </div>
                      <span className={`text-[11px] mt-1.5 font-medium ${
                        currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 sm:w-16 h-0.5 mx-1.5 mt-[-16px] transition-all ${
                          currentStep > step.number ? "bg-success" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Email */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-base font-semibold mb-1">Digite seu e-mail</h2>
                    <p className="text-xs text-muted-foreground mb-4">
                      Vamos verificar se você já tem uma conta cadastrada.
                    </p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleCheckEmail()}
                        className={errors.email ? "border-destructive" : ""}
                        disabled={isCheckingEmail}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <Button 
                      variant="bid" 
                      onClick={handleCheckEmail} 
                      className="w-full sm:w-auto"
                      disabled={isCheckingEmail}
                    >
                      {isCheckingEmail ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Verificando...
                        </>
                      ) : (
                        "Continuar"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Password */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    {/* Show email being used */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">E-mail</p>
                        <p className="text-sm font-medium">{formData.email}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleChangeEmail}
                        className="text-xs text-accent hover:text-accent"
                      >
                        Alterar
                      </Button>
                    </div>

                    <h2 className="text-base font-semibold mb-1">
                      {flow === "login" ? "Digite sua senha" : "Crie sua senha"}
                    </h2>
                    <p className="text-xs text-muted-foreground mb-4">
                      {flow === "login" 
                        ? "Informe sua senha para acessar a conta." 
                        : "Crie uma senha segura com no mínimo 6 caracteres."}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm">Senha</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => {
                              setFormData({ ...formData, password: e.target.value });
                              setErrors((prev) => ({ ...prev, password: "" }));
                            }}
                            onKeyDown={(e) => e.key === "Enter" && handleContinueStep2()}
                            className={errors.password ? "border-destructive pr-10" : "pr-10"}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-xs text-destructive">{errors.password}</p>
                        )}
                      </div>
                      
                      {flow === "register" && (
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm">Confirmar Senha</Label>
                          <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && handleContinueStep2()}
                            className={errors.confirmPassword ? "border-destructive" : ""}
                          />
                          {errors.confirmPassword && (
                            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between gap-3 pt-2">
                    <Button variant="outline" onClick={handleBack}>
                      Voltar
                    </Button>
                    <Button variant="bid" onClick={handleContinueStep2} disabled={isLoading} className="flex-1 sm:flex-none">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Aguarde...
                        </>
                      ) : flow === "login" ? "Entrar" : "Continuar"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Info (Register only) */}
              {currentStep === 3 && flow === "register" && (
                <div className="space-y-4">
                  <div>
                    {/* Show email being used */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">E-mail</p>
                        <p className="text-sm font-medium">{formData.email}</p>
                      </div>
                    </div>

                    <h2 className="text-base font-semibold mb-1">Complete seu cadastro</h2>
                    <p className="text-xs text-muted-foreground mb-4">
                      Informe seus dados para finalizar o cadastro.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm">Nome Completo *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Seu nome completo"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">{errors.name}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm">Telefone *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(00) 00000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                            maxLength={15}
                            className={errors.phone ? "border-destructive" : ""}
                          />
                          {errors.phone && (
                            <p className="text-xs text-destructive">{errors.phone}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cpf" className="text-sm">CPF *</Label>
                          <Input
                            id="cpf"
                            type="text"
                            placeholder="000.000.000-00"
                            value={formData.cpf}
                            onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                            maxLength={14}
                            className={errors.cpf ? "border-destructive" : ""}
                          />
                          {errors.cpf && (
                            <p className="text-xs text-destructive">{errors.cpf}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between gap-3 pt-2">
                    <Button variant="outline" onClick={handleBack}>
                      Voltar
                    </Button>
                    <Button variant="bid" onClick={handleRegister} disabled={isLoading} className="flex-1 sm:flex-none">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        "Criar Conta"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
