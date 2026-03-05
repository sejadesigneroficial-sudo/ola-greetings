import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Loader2, Upload, X, ImageIcon } from "lucide-react";
import { Profile, Product } from "@/contexts/DataContext";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import brasaoImg from "@/assets/brasao-brasil.png";
import logoImgDefault from "@/assets/logo-pdf.png";
import assinaturaLeileiroImg from "@/assets/assinatura-leiloeiro.png";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface PaymentContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentType: "entrega" | "30percent";
  profiles: Profile[];
  products: Product[];
}

interface CasaLeileiraData {
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  numero: string;
  cep: string;
  municipio: string;
  uf: string;
}

interface ArrematanteData {
  nome: string;
  cpfCnpj: string;
  contato1: string;
  contato2: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidadeMunicipio: string;
  uf: string;
}

interface LoteData {
  nomeVeiculo: string;
  ano: string;
  dataArremate: string;
  numeroLote: string;
  valor: number;
  comissaoInclusa: boolean;
  taxaDocumentacao: number;
  fretePorKm: number;
  freteKm: number;
}

interface FinanciamentoData {
  tipo: "avista" | "financiamento";
  entrada: number;
  parcelas: number;
  valorParcela: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

const fetchViaCep = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, "");
  if (cleanCep.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await res.json();
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
};

export function PaymentContractDialog({ open, onOpenChange, profiles, products }: PaymentContractDialogProps) {
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState<"select" | "manual">("select");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [vehicleInputMode, setVehicleInputMode] = useState<"select" | "manual">("select");
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const [selectedProductId, setSelectedProductId] = useState("");

  const [casaLeiloeira, setCasaLeiloeira] = useState<CasaLeileiraData>({
    razaoSocial: "",
    cnpj: "",
    endereco: "",
    numero: "",
    cep: "",
    municipio: "",
    uf: "",
  });

  const [arrematante, setArrematante] = useState<ArrematanteData>({
    nome: "",
    cpfCnpj: "",
    contato1: "",
    contato2: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    cidadeMunicipio: "",
    uf: "",
  });

  const [lote, setLote] = useState<LoteData>({
    nomeVeiculo: "",
    ano: "",
    dataArremate: format(new Date(), "dd/MM/yyyy"),
    numeroLote: "",
    valor: 0,
    comissaoInclusa: true,
    taxaDocumentacao: 0,
    fretePorKm: 0,
    freteKm: 0,
  });

  const [financiamento, setFinanciamento] = useState<FinanciamentoData>({
    tipo: "avista",
    entrada: 0,
    parcelas: 60,
    valorParcela: 0,
  });

  const [dataPagamento, setDataPagamento] = useState(format(new Date(), "dd/MM/yyyy"));
  const [horaPagamento, setHoraPagamento] = useState("17");

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    const profile = profiles.find(p => p.user_id === userId);
    if (profile) {
      setArrematante(prev => ({
        ...prev,
        nome: profile.name || "",
        cpfCnpj: profile.cpf || "",
        contato1: profile.phone || "",
      }));
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find(p => p.id === productId);
    if (product) {
      const bidValue = (product.current_bid || product.starting_bid || 0) + 100;
      setLote(prev => ({
        ...prev,
        nomeVeiculo: product.title || "",
        ano: product.year?.toString() || "",
        numeroLote: product.lot_number || "",
        valor: bidValue,
      }));
    }
  };

  const generatePDF = async () => {
    if (!arrematante.nome || !arrematante.cpfCnpj || !casaLeiloeira.razaoSocial || !casaLeiloeira.cnpj) {
      toast.error("Preencha os campos obrigatórios (nome, CPF, razão social e CNPJ)");
      return;
    }

    setLoading(true);

    try {
      const doc = new jsPDF();
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();
      const m = 15;
      const cw = pw - m * 2;
      let y = m;
      const currentDate = new Date();

      const gray = () => { doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.25); };

      // Load images
      const loadImage = (src: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = src;
      });

      let logoLoaded: HTMLImageElement | null = null;
      let brasaoLoaded: HTMLImageElement | null = null;
      let assinaturaLoaded: HTMLImageElement | null = null;
      try { logoLoaded = await loadImage(customLogoUrl || logoImgDefault); } catch {}
      try { brasaoLoaded = await loadImage(brasaoImg); } catch {}
      try { assinaturaLoaded = await loadImage(assinaturaLeileiroImg); } catch {}

      const addBrasao = (centerY?: number) => {
        if (!brasaoLoaded) return;
        const bSize = 120;
        const bx = (pw - bSize) / 2;
        const by = (centerY ?? (ph / 2)) - bSize / 2;
        doc.saveGraphicsState();
        // @ts-ignore
        doc.setGState(new (doc as any).GState({ opacity: 0.18 }));
        doc.addImage(brasaoLoaded, "PNG", bx, by, bSize, bSize);
        doc.restoreGraphicsState();
      };

      // Helper: draw cell
      const cell = (x: number, yy: number, w: number, h: number, text: string, opts?: {
        bold?: boolean; fs?: number; align?: "left" | "center" | "right";
      }) => {
        const { bold = false, fs = 8, align = "left" } = opts || {};
        gray();
        doc.rect(x, yy, w, h);
        doc.setFontSize(fs);
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setTextColor(0);
        const pad = 2;
        const tx = align === "center" ? x + w / 2 : align === "right" ? x + w - pad : x + pad;
        const maxW = w - pad * 2;
        let t = text;
        while (doc.getTextWidth(t) > maxW && t.length > 0) t = t.slice(0, -1);
        doc.text(t, tx, yy + h / 2 + fs * 0.13, { align });
      };

      // ===== PAGE 1 BRASÃO =====
      addBrasao(ph * 0.52);

      // ===== HEADER (3-cell table: Logo | Title+Company | Logo) =====
      const headerH = 32;
      const logoColW = cw * 0.18;
      const titleColW = cw - logoColW * 2;
      gray();
      // Left logo cell
      doc.rect(m, y, logoColW, headerH);
      if (logoLoaded) {
        const r = logoLoaded.width / logoLoaded.height;
        const lh = 14; const lw = Math.min(lh * r, logoColW - 4);
        doc.addImage(logoLoaded, "PNG", m + (logoColW - lw) / 2, y + (headerH - lh) / 2, lw, lh);
      }
      // Center title cell (includes company name + CNPJ)
      doc.rect(m + logoColW, y, titleColW, headerH);
      const cx0 = m + logoColW + titleColW / 2;
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("TERMO DE ARREMATE", cx0, y + 8, { align: "center" });
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(`DATA DE EMISSÃO: ${format(currentDate, "dd/MM/yyyy")}`, cx0, y + 13, { align: "center" });
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`${casaLeiloeira.cnpj} ${casaLeiloeira.razaoSocial}`, cx0, y + 20, { align: "center" });
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(`CNPJ: ${casaLeiloeira.cnpj}`, cx0, y + 24, { align: "center" });
      // Right logo cell
      doc.rect(m + logoColW + titleColW, y, logoColW, headerH);
      if (logoLoaded) {
        const r = logoLoaded.width / logoLoaded.height;
        const lh = 14; const lw = Math.min(lh * r, logoColW - 4);
        doc.addImage(logoLoaded, "PNG", m + logoColW + titleColW + (logoColW - lw) / 2, y + (headerH - lh) / 2, lw, lh);
      }

      y += headerH + 4;

      // ===== CASA LEILOEIRA TABLE =====
      const rh = 7;
      // Header row
      const clCols = [cw * 0.2, cw * 0.35, cw * 0.08, cw * 0.12, cw * 0.15, cw * 0.1];
      const clLabels = ["Casa Leiloeira", "Endereço", "N°", "CEP", "Município", "UF"];
      let cx = m;
      clLabels.forEach((label, i) => {
        cell(cx, y, clCols[i], rh, label, { bold: true, fs: 7, align: "center" });
        cx += clCols[i];
      });
      y += rh;
      // Data row
      const clData = [
        `${casaLeiloeira.razaoSocial} CNPJ: ${casaLeiloeira.cnpj}`,
        casaLeiloeira.endereco,
        casaLeiloeira.numero || "-",
        casaLeiloeira.cep,
        casaLeiloeira.municipio,
        casaLeiloeira.uf,
      ];
      cx = m;
      clData.forEach((val, i) => {
        cell(cx, y, clCols[i], rh + 2, val, { fs: i === 0 ? 5.5 : 7 });
        cx += clCols[i];
      });
      y += rh + 5;

      // ===== DADOS DO ARREMATANTE =====
      gray();
      doc.rect(m, y, cw, 8);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("DADOS DO ARREMATANTE", pw / 2, y + 5.5, { align: "center" });
      y += 8;

      // Row 1 headers
      const aCols = [cw * 0.3, cw * 0.25, cw * 0.22, cw * 0.23];
      const aLabels = ["Nome", "CNPJ/CPF", "CONTATO 1", "CONTATO 2"];
      cx = m;
      aLabels.forEach((label, i) => {
        cell(cx, y, aCols[i], rh, label, { bold: true, fs: 7, align: "center" });
        cx += aCols[i];
      });
      y += rh;
      // Row 1 data
      cx = m;
      [arrematante.nome, arrematante.cpfCnpj, arrematante.contato1, arrematante.contato2].forEach((val, i) => {
        cell(cx, y, aCols[i], rh, val, { fs: 8 });
        cx += aCols[i];
      });
      y += rh;

      // Row 2 headers
      const bCols = [cw * 0.25, cw * 0.07, cw * 0.08, cw * 0.15, cw * 0.12, cw * 0.23, cw * 0.1];
      const bLabels = ["Endereço", "N°", "Comp", "Bairro", "CEP", "Cidade/ Município", "UF"];
      cx = m;
      bLabels.forEach((label, i) => {
        cell(cx, y, bCols[i], rh, label, { bold: true, fs: 6.5, align: "center" });
        cx += bCols[i];
      });
      y += rh;
      // Row 2 data
      cx = m;
      [arrematante.endereco, arrematante.numero, arrematante.complemento, arrematante.bairro, arrematante.cep, arrematante.cidadeMunicipio, arrematante.uf].forEach((val, i) => {
        cell(cx, y, bCols[i], rh, val, { fs: 7 });
        cx += bCols[i];
      });
      y += rh + 5;

      // ===== DESCRIÇÃO DO LOTE =====
      gray();
      doc.rect(m, y, cw, 7);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("DESCRIÇÃO DO LOTE", pw / 2, y + 5, { align: "center" });
      y += 7;

      // Vehicle headers
      cell(m, y, cw * 0.6, rh, "NOME DOS VEÍCULOS ARREMATADOS", { bold: true, fs: 7, align: "center" });
      cell(m + cw * 0.6, y, cw * 0.4, rh, "DATA DO ARREMATE", { bold: true, fs: 7, align: "center" });
      y += rh;

      // Vehicle data row with borders
      const vehNameW = cw * 0.6;
      const vehDateW = cw * 0.4;
      const vehDataH = 10;
      gray();
      doc.rect(m, y, vehNameW, vehDataH);
      doc.rect(m + vehNameW, y, vehDateW, vehDataH);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text(`${lote.nomeVeiculo} ${lote.ano ? `ANO: ${lote.ano}` : ""}`, m + 3, y + vehDataH / 2 + 1);
      doc.setFontSize(12);
      doc.text(lote.dataArremate, m + vehNameW + vehDateW / 2, y + vehDataH / 2 + 2, { align: "center" });
      y += vehDataH;

      // Values table headers
      const freteTotal = lote.fretePorKm * lote.freteKm;
      const totalGeral = lote.valor + lote.taxaDocumentacao + freteTotal;
      const vc = [cw * 0.12, cw * 0.18, cw * 0.17, cw * 0.15, cw * 0.12, cw * 0.26];
      const vLabels = ["N°do Lote", "Valor", "Comissão (5%)", "Documento", "Frete", "TOTAL"];
      cx = m;
      vLabels.forEach((label, i) => {
        cell(cx, y, vc[i], rh, label, { bold: true, fs: 7, align: "center" });
        cx += vc[i];
      });
      y += rh;
      // Values data
      const docStr = lote.taxaDocumentacao > 0 ? `R$ ${formatCurrency(lote.taxaDocumentacao)}` : "Incl.";
      const freteStr = freteTotal > 0 ? `R$ ${formatCurrency(freteTotal)}` : "Incl.";
      const vData = [lote.numeroLote, formatCurrency(lote.valor), "Incluso", docStr, freteStr, `R$ ${formatCurrency(totalGeral)}`];
      cx = m;
      vData.forEach((val, i) => {
        cell(cx, y, vc[i], rh, val, { bold: i === 5, fs: i === 5 ? 8 : 7, align: "center" });
        cx += vc[i];
      });
      y += rh;

      // Financiamento
      if (financiamento.tipo === "financiamento") {
        const valorFinanciado = lote.valor - financiamento.entrada;
        const finText = `FINANCIAMENTO parcelado: Entrada de R$ ${formatCurrency(financiamento.entrada)} + ${financiamento.parcelas}x de R$ ${formatCurrency(financiamento.valorParcela)}. Valor total financiado: R$ ${formatCurrency(valorFinanciado)}.`;
        gray();
        doc.rect(m, y, cw, 7);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text(finText, pw / 2, y + 4.5, { align: "center" });
        y += 7;
      }
      y += 4;

      // ===== DADOS PARA PAGAMENTO =====
      const pagesWithBrasao = new Set<number>([1]);
      const checkPage = (needed: number) => {
        if (y + needed > ph - 20) {
          doc.addPage();
          y = m;
          const pg = doc.getNumberOfPages();
          if (!pagesWithBrasao.has(pg)) {
            pagesWithBrasao.add(pg);
            addBrasao(ph * 0.52);
          }
        }
      };

      checkPage(12);
      gray();
      doc.rect(m, y, cw, 8);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`DADOS PARA PAGAMENTO O PAGAMENTO DEVE SER FEITO ATÉ ${dataPagamento} ÀS ${horaPagamento}H.`, pw / 2, y + 5, { align: "center" });
      y += 11;

      // ===== REVISÃO DE LEILOEIRO =====
      const revParagraphs = [
        `Por medidas de segurança, nós da ${casaLeiloeira.razaoSocial} prezando sempre pelo bem-estar e segurança de nossos clientes.`,
        `Visando garantir que o pagamento realizado seja feito na conta bancária do Preposto pelo leiloeiro(a) responsável, devidamente reconhecido e cadastrado junto a JUCESP.`,
        `O bem será liberado para retirada mediante Nota Fiscal. O pagamento deverá ser feito impreterivelmente até as ${horaPagamento}:00 horas do dia da reserva.`,
        `O pagamento deverá ser realizado na conta corrente bancária do representante financeiro indicada pelo comitente em Dinheiro, TED ou PIX.`,
        `Em um contrato de financiamento do bem arrematado, a alienação fiduciária faz com que o bem pertença ao comprador vinculado a financiadora até que as prestações sejam quitadas. Caso haja um atraso nas parcelas, o credor pode entrar com um processo judicial para reaver o bem.`,
      ];
      // Calculate total height for revisão box
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      let revTotalH = 10; // title height
      revParagraphs.forEach(p => {
        const lines = doc.splitTextToSize(p, cw - 6);
        revTotalH += lines.length * 3.5 + 1;
      });
      revTotalH += 2;
      checkPage(revTotalH);
      gray();
      doc.rect(m, y, cw, 8);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("REVISÃO DE LEILOEIRO(a) NA JUNTA COMERCIAL", pw / 2, y + 5.5, { align: "center" });
      y += 8;
      const revStartY = y;
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0);
      revParagraphs.forEach(p => {
        const lines = doc.splitTextToSize(p, cw - 6);
        lines.forEach((line: string) => {
          doc.text(line, pw / 2, y + 3, { align: "center" });
          y += 3.5;
        });
        y += 1;
      });
      y += 2;
      gray();
      doc.rect(m, revStartY, cw, y - revStartY);

      // ===== OBSERVAÇÕES IMPORTANTES =====
      checkPage(25);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("OBSERVAÇÕES IMPORTANTES:", m, y + 4);
      y += 7;

      const obsText = "No caso de depósitos através de DOC, a Nota de venda somente será liberada no dia seguinte da data de depósito. Não serão aceitos depósitos feitos em caixas eletrônicos, bem como depósitos em cheques (comuns ou administrativos). Os depósitos estarão sujeitos a confirmação mediante apresentação do comprovante do depósito com devida autenticação bancários dentro do prazo estabelecido, sob pena de perda de 40% do valor da arrematação em favor do comitente vendedor, bem como da comissão do leiloeiro, nos termos do artigo 418 do código civil brasileiro.";
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      const obsLines = doc.splitTextToSize(obsText, cw - 6);
      const obsH = obsLines.length * 2.8 + 4;
      checkPage(obsH);
      gray();
      doc.rect(m, y, cw, obsH);
      doc.text(obsLines, m + 3, y + 4);
      y += obsH + 4;

      // ===== INSTRUÇÕES PARA ENTREGA =====
      checkPage(55);
      gray();
      doc.rect(m, y, cw, 7);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("INSTRUÇÕES PARA ENTREGA", pw / 2, y + 5, { align: "center" });
      y += 7;
      const instrStartY = y;

      const instrucoes = [
        { label: "Entrega do bem:", text: "O bem arrematado será entregue somente após a integralização total dos pagamentos conforme estabelecido neste termo." },
        { label: "Prazo de Entrega:", text: "O prazo máximo para entrega do lote será de 03 (três) a 05 (cinco) dias úteis após confirmação do pagamento." },
        { label: "Frete:", text: "Em caso de entrega no endereço do arrematante, o valor do frete será calculado conforme distância e comunicado previamente." },
        { label: "Documentação:", text: "A transferência e regularização documental será providenciada pela casa leiloeira no prazo de até 30 (trinta) dias úteis." },
      ];

      const labelW = cw * 0.22;
      const descW = cw * 0.78;
      instrucoes.forEach(item => {
        doc.setFontSize(7);
        const lines = doc.splitTextToSize(item.text, descW - 6);
        const rowH = Math.max(9, lines.length * 3.5 + 3);
        checkPage(rowH);
        gray();
        doc.rect(m, y, labelW, rowH);
        doc.rect(m + labelW, y, descW, rowH);
        doc.setFont("helvetica", "bold");
        doc.text(item.label, m + 3, y + rowH / 2 + 1);
        doc.setFont("helvetica", "normal");
        doc.text(lines, m + labelW + 3, y + 4);
        y += rowH;
      });
      // Outer border for all instruções rows
      gray();
      doc.rect(m, instrStartY, cw, y - instrStartY);
      y += 4;

      // ===== IMPORTANTE =====
      checkPage(22);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("IMPORTANTE:", m, y + 4);
      y += 7;

      gray();
      doc.rect(m, y, cw, 14);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(`NOME COMPLETO: ${arrematante.nome}`, m + 3, y + 5);
      doc.text(`CPF/CNPJ: ${arrematante.cpfCnpj}`, m + 3, y + 9);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text("Sem este termo de arrematação e nota fiscal não é possível a retirada do bem. Não imprimimos a carta no local.", m + 3, y + 13);
      y += 17;

      // ===== DECLARAÇÃO DE ACEITAÇÃO =====
      checkPage(45);
      gray();
      doc.rect(m, y, cw, 7);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("DECLARAÇÃO DE ACEITAÇÃO E TERMO DE RESPONSABILIDADE", pw / 2, y + 5, { align: "center" });
      y += 7;

      const declStartY = y;
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("Confirmo o arremate acima e declaro estar ciente e de acordo com todas as condições estabelecidas no catálogo e edital de leilão.", m + 3, y + 4);
      y += 15;

      // Arrematante signature line
      gray();
      doc.line(m + 10, y, m + cw * 0.45, y);
      doc.setFontSize(7);
      doc.text("Assinatura do Arrematante", m + 10, y + 5);
      y += 10;
      gray();
      doc.rect(m, declStartY, cw, y - declStartY);

      // ===== LEILOEIRO BOX =====
      checkPage(35);
      gray();
      doc.rect(m, y, cw, 28);

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("LEILOEIRO RESPONSAVEL:", m + 3, y + 5);
      doc.text(`${casaLeiloeira.razaoSocial}`, m + 3, y + 10);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(`CNPJ: ${casaLeiloeira.cnpj}`, m + 3, y + 14);

      // Signature image on the right
      const sigRight = m + cw - 5;
      const sigLeft = m + cw * 0.55;
      if (assinaturaLoaded) {
        const aH = 14;
        const aR = assinaturaLoaded.width / assinaturaLoaded.height;
        const aW = aH * aR;
        const aX = sigLeft + (sigRight - sigLeft - aW) / 2;
        doc.addImage(assinaturaLoaded, "PNG", aX, y + 4, aW, aH);
      }
      gray();
      doc.line(sigLeft, y + 20, sigRight, y + 20);
      doc.setFontSize(7);
      doc.text("Assinatura do Leiloeiro", sigLeft + (sigRight - sigLeft) / 2, y + 25, { align: "center" });
      y += 32;

      // ===== DIGITAL SIGNATURE NOTICE =====
      checkPage(15);
      gray();
      doc.rect(m, y, cw, 12);
      doc.setFontSize(6);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100);
      doc.text("DOCUMENTO ASSINADO DIGITALMENTE NOS TERMOS DA LEI 11.419/2006, CONFORME IMPRESSÃO À MARGEM DIREITA", pw / 2, y + 4, { align: "center" });
      doc.text(`Documento gerado em ${format(currentDate, "dd/MM/yyyy")}`, pw / 2, y + 9, { align: "center" });

      // Save PDF
      const contractNumber = `${format(currentDate, "yyyyMMdd")}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const fileName = `termo_arremate_${contractNumber}_${arrematante.nome.replace(/\s+/g, "_").substring(0, 20)}.pdf`;
      doc.save(fileName);

      // Save to database
      try {
        await supabase.from("contracts").insert({
          contract_number: contractNumber,
          payment_type: financiamento.tipo === "financiamento" ? "financiamento" : "avista",
          buyer_name: arrematante.nome,
          buyer_cpf: arrematante.cpfCnpj,
          buyer_email: null,
          buyer_phone: arrematante.contato1 || null,
          seller_name: casaLeiloeira.razaoSocial,
          seller_cnpj: casaLeiloeira.cnpj,
          vehicle_description: `${lote.nomeVeiculo} ${lote.ano ? `ANO: ${lote.ano}` : ""}`,
          vehicle_lot_number: lote.numeroLote || null,
          bid_value: lote.valor,
          freight_value: lote.fretePorKm * lote.freteKm,
          total_value: lote.valor + lote.taxaDocumentacao + (lote.fretePorKm * lote.freteKm),
          deposit_value: financiamento.tipo === "financiamento" ? financiamento.entrada : null,
          remaining_value: financiamento.tipo === "financiamento" ? (lote.valor + lote.taxaDocumentacao + (lote.fretePorKm * lote.freteKm)) - financiamento.entrada : null,
        });
      } catch (dbError) {
        console.error("Error saving contract:", dbError);
      }

      toast.success("Termo de Arremate gerado com sucesso!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Termo de Arremate
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Logo Upload */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Logo do Contrato</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {customLogoUrl ? (
                  <div className="relative">
                    <img src={customLogoUrl} alt="Logo" className="h-14 max-w-[180px] object-contain border rounded p-1" />
                    <button
                      type="button"
                      onClick={() => setCustomLogoUrl(null)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="h-14 w-[180px] border-2 border-dashed rounded flex items-center justify-center text-muted-foreground text-xs">
                    Logo padrão
                  </div>
                )}
                <div>
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Imagem deve ter no máximo 5MB");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => setCustomLogoUrl(ev.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => logoFileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-1" />
                    {customLogoUrl ? "Trocar Logo" : "Enviar Logo"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">PNG ou JPG, máx 5MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Casa Leiloeira */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Casa Leiloeira</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label>Razão Social *</Label>
                <Input value={casaLeiloeira.razaoSocial} onChange={e => setCasaLeiloeira({ ...casaLeiloeira, razaoSocial: e.target.value })} />
              </div>
              <div>
                <Label>CNPJ *</Label>
                <Input value={casaLeiloeira.cnpj} onChange={e => setCasaLeiloeira({ ...casaLeiloeira, cnpj: e.target.value })} placeholder="00.000.000/0000-00" />
              </div>
              <div className="col-span-2">
                <Label>Endereço</Label>
                <Input value={casaLeiloeira.endereco} onChange={e => setCasaLeiloeira({ ...casaLeiloeira, endereco: e.target.value })} />
              </div>
              <div>
                <Label>N°</Label>
                <Input value={casaLeiloeira.numero} onChange={e => setCasaLeiloeira({ ...casaLeiloeira, numero: e.target.value })} />
              </div>
              <div>
                <Label>CEP</Label>
                <Input value={casaLeiloeira.cep} onChange={e => setCasaLeiloeira({ ...casaLeiloeira, cep: e.target.value })} onBlur={async (e) => {
                  const data = await fetchViaCep(e.target.value);
                  if (data) {
                    setCasaLeiloeira(prev => ({ ...prev, endereco: data.logradouro || prev.endereco, municipio: data.localidade || prev.municipio, uf: data.uf || prev.uf }));
                    toast.success("Endereço preenchido automaticamente!");
                  }
                }} placeholder="00000-000" />
              </div>
              <div>
                <Label>Município</Label>
                <Input value={casaLeiloeira.municipio} onChange={e => setCasaLeiloeira({ ...casaLeiloeira, municipio: e.target.value })} />
              </div>
              <div>
                <Label>UF</Label>
                <Input value={casaLeiloeira.uf} onChange={e => setCasaLeiloeira({ ...casaLeiloeira, uf: e.target.value })} maxLength={2} />
              </div>
            </CardContent>
          </Card>

          {/* Arrematante */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Dados do Arrematante</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Tabs value={inputMode} onValueChange={v => setInputMode(v as "select" | "manual")}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="select">Selecionar Usuário</TabsTrigger>
                  <TabsTrigger value="manual">Digitar Manualmente</TabsTrigger>
                </TabsList>
                <TabsContent value="select" className="mt-3">
                  <Select value={selectedUserId} onValueChange={handleSelectUser}>
                    <SelectTrigger><SelectValue placeholder="Selecione um usuário" /></SelectTrigger>
                    <SelectContent>
                      {profiles.map(p => (
                        <SelectItem key={p.user_id} value={p.user_id || ""}>{p.name} - {p.email}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>
                <TabsContent value="manual" className="mt-3 grid grid-cols-2 gap-3">
                  <div className="col-span-2"><Label>Nome *</Label><Input value={arrematante.nome} onChange={e => setArrematante({ ...arrematante, nome: e.target.value })} /></div>
                  <div><Label>CPF/CNPJ *</Label><Input value={arrematante.cpfCnpj} onChange={e => setArrematante({ ...arrematante, cpfCnpj: e.target.value })} /></div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div><Label>CPF/CNPJ *</Label><Input value={arrematante.cpfCnpj} onChange={e => setArrematante({ ...arrematante, cpfCnpj: e.target.value })} /></div>
                <div><Label>Contato 1</Label><Input value={arrematante.contato1} onChange={e => setArrematante({ ...arrematante, contato1: e.target.value })} placeholder="(00) 00000-0000" /></div>
                <div><Label>Contato 2</Label><Input value={arrematante.contato2} onChange={e => setArrematante({ ...arrematante, contato2: e.target.value })} /></div>
                <div className="col-span-2 md:col-span-1"><Label>Endereço</Label><Input value={arrematante.endereco} onChange={e => setArrematante({ ...arrematante, endereco: e.target.value })} /></div>
                <div><Label>N°</Label><Input value={arrematante.numero} onChange={e => setArrematante({ ...arrematante, numero: e.target.value })} /></div>
                <div><Label>Comp</Label><Input value={arrematante.complemento} onChange={e => setArrematante({ ...arrematante, complemento: e.target.value })} /></div>
                <div><Label>Bairro</Label><Input value={arrematante.bairro} onChange={e => setArrematante({ ...arrematante, bairro: e.target.value })} /></div>
                <div><Label>CEP</Label><Input value={arrematante.cep} onChange={e => setArrematante({ ...arrematante, cep: e.target.value })} onBlur={async (e) => {
                  const data = await fetchViaCep(e.target.value);
                  if (data) {
                    setArrematante(prev => ({ ...prev, endereco: data.logradouro || prev.endereco, bairro: data.bairro || prev.bairro, cidadeMunicipio: data.localidade || prev.cidadeMunicipio, uf: data.uf || prev.uf, complemento: data.complemento || prev.complemento }));
                    toast.success("Endereço preenchido automaticamente!");
                  }
                }} placeholder="00000-000" /></div>
                <div><Label>Cidade/Município</Label><Input value={arrematante.cidadeMunicipio} onChange={e => setArrematante({ ...arrematante, cidadeMunicipio: e.target.value })} /></div>
                <div><Label>UF</Label><Input value={arrematante.uf} onChange={e => setArrematante({ ...arrematante, uf: e.target.value })} maxLength={2} /></div>
              </div>
            </CardContent>
          </Card>

          {/* Lote */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Descrição do Lote</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Tabs value={vehicleInputMode} onValueChange={v => setVehicleInputMode(v as "select" | "manual")}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="select">Selecionar Produto</TabsTrigger>
                  <TabsTrigger value="manual">Digitar Manualmente</TabsTrigger>
                </TabsList>
                <TabsContent value="select" className="mt-3">
                  <Select value={selectedProductId} onValueChange={handleSelectProduct}>
                    <SelectTrigger><SelectValue placeholder="Selecione um produto" /></SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.title} - Lote {p.lot_number || "S/N"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="col-span-2"><Label>Nome do Veículo *</Label><Input value={lote.nomeVeiculo} onChange={e => setLote({ ...lote, nomeVeiculo: e.target.value })} /></div>
                <div><Label>Ano</Label><Input value={lote.ano} onChange={e => setLote({ ...lote, ano: e.target.value })} /></div>
                <div><Label>N° Lote</Label><Input value={lote.numeroLote} onChange={e => setLote({ ...lote, numeroLote: e.target.value })} /></div>
                <div><Label>Valor (R$) *</Label><Input type="number" value={lote.valor || ""} onChange={e => setLote({ ...lote, valor: Number(e.target.value) })} /></div>
                <div><Label>Data Arremate</Label><Input value={lote.dataArremate} onChange={e => setLote({ ...lote, dataArremate: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                <div><Label>Taxa Documentação (R$)</Label><Input type="number" value={lote.taxaDocumentacao || ""} onChange={e => setLote({ ...lote, taxaDocumentacao: Number(e.target.value) })} placeholder="0,00" /></div>
                <div><Label>Frete por KM (R$)</Label><Input type="number" value={lote.fretePorKm || ""} onChange={e => setLote({ ...lote, fretePorKm: Number(e.target.value) })} placeholder="0,00" /></div>
                <div><Label>Quantos KM</Label><Input type="number" value={lote.freteKm || ""} onChange={e => setLote({ ...lote, freteKm: Number(e.target.value) })} placeholder="0" /></div>
              </div>
              {(lote.taxaDocumentacao > 0 || (lote.fretePorKm > 0 && lote.freteKm > 0)) && (
                <div className="text-xs text-muted-foreground pt-1">
                  Frete total: R$ {formatCurrency(lote.fretePorKm * lote.freteKm)} | Documentação: R$ {formatCurrency(lote.taxaDocumentacao)} | <strong>Total geral: R$ {formatCurrency(lote.valor + lote.taxaDocumentacao + lote.fretePorKm * lote.freteKm)}</strong>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagamento */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Pagamento</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <Label>Tipo</Label>
                  <Select value={financiamento.tipo} onValueChange={v => setFinanciamento({ ...financiamento, tipo: v as "avista" | "financiamento" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="avista">À Vista</SelectItem>
                      <SelectItem value="financiamento">Financiamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Data Pagamento</Label><Input value={dataPagamento} onChange={e => setDataPagamento(e.target.value)} /></div>
                <div><Label>Hora Limite</Label><Input value={horaPagamento} onChange={e => setHoraPagamento(e.target.value)} placeholder="17" /></div>
              </div>

              {financiamento.tipo === "financiamento" && (
                <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                  <div><Label>Entrada (R$)</Label><Input type="number" value={financiamento.entrada || ""} onChange={e => setFinanciamento({ ...financiamento, entrada: Number(e.target.value) })} /></div>
                  <div><Label>Parcelas</Label><Input type="number" value={financiamento.parcelas || ""} onChange={e => setFinanciamento({ ...financiamento, parcelas: Number(e.target.value) })} /></div>
                  <div><Label>Valor Parcela (R$)</Label><Input type="number" value={financiamento.valorParcela || ""} onChange={e => setFinanciamento({ ...financiamento, valorParcela: Number(e.target.value) })} /></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button onClick={generatePDF} disabled={loading} className="w-full" size="lg">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Gerar Termo de Arremate (PDF)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
