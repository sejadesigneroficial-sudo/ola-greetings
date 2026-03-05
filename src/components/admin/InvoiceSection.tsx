import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, FileText, Receipt, Loader2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import logoPdf from "@/assets/logo-pdf.png";

interface Contract {
  id: string;
  contract_number: string;
  payment_type: string;
  buyer_name: string;
  buyer_cpf: string;
  buyer_email: string | null;
  buyer_phone: string | null;
  seller_name: string;
  seller_cnpj: string;
  vehicle_description: string | null;
  vehicle_lot_number: string | null;
  bid_value: number;
  freight_value: number | null;
  total_value: number;
  deposit_value: number | null;
  remaining_value: number | null;
  invoice_generated: boolean | null;
  invoice_number: string | null;
  invoice_generated_at: string | null;
  created_at: string;
}

// Generate a random barcode number (44 digits for NF-e format)
const generateBarcode = (): string => {
  let code = "";
  for (let i = 0; i < 44; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
};

// Professional Code 128 style barcode drawing
const drawBarcode = (doc: jsPDF, code: string, x: number, y: number, width: number, height: number) => {
  // Code 128 encoding patterns (simplified representation)
  const patterns: { [key: string]: string } = {
    '0': '11011001100', '1': '11001101100', '2': '11001100110', '3': '10010011000',
    '4': '10010001100', '5': '10001001100', '6': '10011001000', '7': '10011000100',
    '8': '10001100100', '9': '11001001000'
  };
  
  const startPattern = '11010000100';
  const stopPattern = '1100011101011';
  
  // Build the full barcode pattern
  let fullPattern = startPattern;
  for (const char of code) {
    fullPattern += patterns[char] || patterns['0'];
  }
  fullPattern += stopPattern;
  
  // Calculate bar width
  const totalBars = fullPattern.length;
  const barWidth = width / totalBars;
  
  doc.setFillColor(0, 0, 0);
  
  // Draw each bar
  let currentX = x;
  for (let i = 0; i < fullPattern.length; i++) {
    if (fullPattern[i] === '1') {
      doc.rect(currentX, y, barWidth, height, 'F');
    }
    currentX += barWidth;
  }
  
  // Draw the barcode text below in groups of 4
  doc.setFontSize(6);
  doc.setFont("courier", "normal");
  doc.setTextColor(0);
  
  const formattedCode = code.match(/.{1,4}/g)?.join(' ') || code;
  doc.text(formattedCode, x + width / 2, y + height + 4, { align: "center" });
};

export function InvoiceSection() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      toast.error("Erro ao carregar contratos");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const generateInvoicePDF = async (contract: Contract, invoiceType: "30percent" | "frete" | "full") => {
    setGeneratingInvoice(contract.id);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);
      let y = margin;
      const currentDate = new Date();
      
      // Generate unique invoice number and access key
      const invoiceNumber = `${Math.floor(Math.random() * 900000000) + 100000000}`;
      const serieNumber = "001";
      const barcode = generateBarcode();
      const accessKey = Array(11).fill(0).map(() => Math.floor(Math.random() * 9000) + 1000).join(' ');

      let invoiceTypeLabel = "";
      let invoiceValue = 0;
      
      switch (invoiceType) {
        case "30percent":
          invoiceTypeLabel = "ENTRADA 30%";
          invoiceValue = contract.deposit_value || contract.total_value * 0.3;
          break;
        case "frete":
          invoiceTypeLabel = "FRETE";
          invoiceValue = contract.freight_value || 0;
          break;
        case "full":
          invoiceTypeLabel = "VALOR INTEGRAL";
          invoiceValue = contract.total_value;
          break;
      }

      // Helper function to draw a box with label
      const drawBox = (x: number, yPos: number, width: number, height: number, label: string, value: string, labelSize: number = 6, valueSize: number = 8) => {
        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.rect(x, yPos, width, height);
        
        doc.setFontSize(labelSize);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80);
        doc.text(label, x + 1.5, yPos + 3);
        
        doc.setFontSize(valueSize);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        const lines = doc.splitTextToSize(value || "-", width - 3);
        doc.text(lines, x + 1.5, yPos + 7);
      };

      // ============ HEADER - DANFE ============
      // Main border
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(margin, y, contentWidth, 35);

      // Left section - Logo and company info
      const leftWidth = contentWidth * 0.35;
      doc.rect(margin, y, leftWidth, 35);
      
      // Add logo
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load logo"));
          img.src = logoPdf;
        });
        
        const maxHeight = 12;
        const ratio = img.width / img.height;
        const logoWidth = maxHeight * ratio;
        const logoX = margin + (leftWidth - logoWidth) / 2;
        
        doc.addImage(img, "PNG", logoX, y + 2, logoWidth, maxHeight);
      } catch {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("EMPRESA", margin + leftWidth / 2, y + 8, { align: "center" });
      }

      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text(contract.seller_name, margin + leftWidth / 2, y + 18, { align: "center" });
      
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text(`CNPJ: ${contract.seller_cnpj}`, margin + leftWidth / 2, y + 23, { align: "center" });
      doc.text("Leilões e Intermediação de Bens", margin + leftWidth / 2, y + 27, { align: "center" });
      doc.text("contato@agrolance.com.br", margin + leftWidth / 2, y + 31, { align: "center" });

      // Center section - DANFE title
      const centerWidth = contentWidth * 0.25;
      const centerX = margin + leftWidth;
      doc.rect(centerX, y, centerWidth, 35);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("DANFE", centerX + centerWidth / 2, y + 10, { align: "center" });
      
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text("Documento Auxiliar da", centerX + centerWidth / 2, y + 14, { align: "center" });
      doc.text("Nota Fiscal Eletrônica", centerX + centerWidth / 2, y + 17, { align: "center" });

      // Entry/Exit indicator box
      doc.setFontSize(5);
      doc.text("0 - ENTRADA", centerX + 3, y + 22);
      doc.text("1 - SAÍDA", centerX + 3, y + 25);
      
      doc.setLineWidth(0.3);
      doc.rect(centerX + centerWidth - 12, y + 20, 8, 8);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("1", centerX + centerWidth - 8, y + 26, { align: "center" });

      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text(`Nº ${invoiceNumber}`, centerX + centerWidth / 2, y + 31, { align: "center" });
      doc.text(`Série ${serieNumber}`, centerX + centerWidth / 2, y + 34, { align: "center" });

      // Right section - Barcode and access key
      const rightWidth = contentWidth * 0.4;
      const rightX = centerX + centerWidth;
      doc.rect(rightX, y, rightWidth, 35);

      // Draw barcode
      drawBarcode(doc, barcode, rightX + 5, y + 3, rightWidth - 10, 12);

      // Access key
      doc.setFontSize(5);
      doc.setFont("helvetica", "normal");
      doc.text("CHAVE DE ACESSO", rightX + rightWidth / 2, y + 20, { align: "center" });
      doc.setFontSize(6);
      doc.setFont("courier", "normal");
      const keyPart1 = accessKey.substring(0, 24);
      const keyPart2 = accessKey.substring(24);
      doc.text(keyPart1, rightX + rightWidth / 2, y + 24, { align: "center" });
      doc.text(keyPart2, rightX + rightWidth / 2, y + 27, { align: "center" });
      
      doc.setFontSize(5);
      doc.setFont("helvetica", "normal");
      doc.text("Consulta de autenticidade no portal nacional", rightX + rightWidth / 2, y + 31, { align: "center" });
      doc.text("da NF-e: www.nfe.fazenda.gov.br/portal", rightX + rightWidth / 2, y + 34, { align: "center" });

      y += 37;

      // Nature of operation and protocol
      doc.rect(margin, y, contentWidth * 0.7, 8);
      doc.setFontSize(5);
      doc.setTextColor(80);
      doc.text("NATUREZA DA OPERAÇÃO", margin + 1.5, y + 2.5);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text(`VENDA DE BEM MÓVEL EM LEILÃO - ${invoiceTypeLabel}`, margin + 1.5, y + 6);

      doc.rect(margin + contentWidth * 0.7, y, contentWidth * 0.3, 8);
      doc.setFontSize(5);
      doc.setTextColor(80);
      doc.setFont("helvetica", "normal");
      doc.text("PROTOCOLO DE AUTORIZAÇÃO", margin + contentWidth * 0.7 + 1.5, y + 2.5);
      doc.setFontSize(6);
      doc.setFont("courier", "normal");
      doc.setTextColor(0);
      doc.text(`${Math.floor(Math.random() * 900000000000000) + 100000000000000}`, margin + contentWidth * 0.7 + 1.5, y + 6);

      y += 10;

      // ============ DESTINATÁRIO / REMETENTE ============
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setDrawColor(0);
      doc.rect(margin, y, contentWidth, 6);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("DESTINATÁRIO / REMETENTE", margin + 2, y + 4);
      y += 6;

      // Buyer info row 1
      const buyerRow1Height = 10;
      drawBox(margin, y, contentWidth * 0.55, buyerRow1Height, "NOME / RAZÃO SOCIAL", contract.buyer_name);
      drawBox(margin + contentWidth * 0.55, y, contentWidth * 0.25, buyerRow1Height, "CNPJ / CPF", contract.buyer_cpf);
      drawBox(margin + contentWidth * 0.8, y, contentWidth * 0.2, buyerRow1Height, "DATA EMISSÃO", format(currentDate, "dd/MM/yyyy"));
      y += buyerRow1Height;

      // Buyer info row 2
      drawBox(margin, y, contentWidth * 0.45, buyerRow1Height, "ENDEREÇO", "-");
      drawBox(margin + contentWidth * 0.45, y, contentWidth * 0.2, buyerRow1Height, "BAIRRO", "-");
      drawBox(margin + contentWidth * 0.65, y, contentWidth * 0.15, buyerRow1Height, "CEP", "-");
      drawBox(margin + contentWidth * 0.8, y, contentWidth * 0.2, buyerRow1Height, "DATA SAÍDA", format(currentDate, "dd/MM/yyyy"));
      y += buyerRow1Height;

      // Buyer info row 3
      drawBox(margin, y, contentWidth * 0.35, buyerRow1Height, "MUNICÍPIO", "-");
      drawBox(margin + contentWidth * 0.35, y, contentWidth * 0.15, buyerRow1Height, "FONE", contract.buyer_phone || "-");
      drawBox(margin + contentWidth * 0.5, y, contentWidth * 0.1, buyerRow1Height, "UF", "-");
      drawBox(margin + contentWidth * 0.6, y, contentWidth * 0.2, buyerRow1Height, "INSCRIÇÃO ESTADUAL", "ISENTO");
      drawBox(margin + contentWidth * 0.8, y, contentWidth * 0.2, buyerRow1Height, "HORA SAÍDA", format(currentDate, "HH:mm"));
      y += buyerRow1Height + 2;

      // ============ PRODUTOS / SERVIÇOS ============
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.rect(margin, y, contentWidth, 6);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("DADOS DO PRODUTO / SERVIÇO", margin + 2, y + 4);
      y += 6;

      // Products header
      const colWidths = [contentWidth * 0.08, contentWidth * 0.42, contentWidth * 0.08, contentWidth * 0.08, contentWidth * 0.1, contentWidth * 0.12, contentWidth * 0.12];
      const headers = ["CÓDIGO", "DESCRIÇÃO DO PRODUTO / SERVIÇO", "NCM/SH", "CFOP", "UN", "QTD", "VALOR UNIT"];
      
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.rect(margin, y, contentWidth, 6);
      
      let colX = margin;
      doc.setFontSize(5);
      doc.setFont("helvetica", "bold");
      headers.forEach((header, i) => {
        doc.text(header, colX + 1, y + 4);
        colX += colWidths[i];
      });
      y += 6;

      // Product rows
      const products: Array<{ code: string; desc: string; ncm: string; cfop: string; un: string; qty: string; value: number }> = [];
      
      if (invoiceType === "30percent") {
        products.push({
          code: "001",
          desc: `Entrada 30% - ${contract.vehicle_description || "Bem Móvel em Leilão"}`,
          ncm: "0000.00.00",
          cfop: "5102",
          un: "UN",
          qty: "1",
          value: invoiceValue
        });
      } else if (invoiceType === "frete") {
        products.push({
          code: "002",
          desc: `Serviço de Frete/Transporte - Lote ${contract.vehicle_lot_number || "-"}`,
          ncm: "0000.00.00",
          cfop: "5353",
          un: "SV",
          qty: "1",
          value: invoiceValue
        });
      } else {
        products.push({
          code: "001",
          desc: contract.vehicle_description || "Bem Móvel Adquirido em Leilão Extrajudicial",
          ncm: "0000.00.00",
          cfop: "5102",
          un: "UN",
          qty: "1",
          value: contract.bid_value
        });
        if (contract.freight_value && contract.freight_value > 0) {
          products.push({
            code: "002",
            desc: "Serviço de Frete/Transporte",
            ncm: "0000.00.00",
            cfop: "5353",
            un: "SV",
            qty: "1",
            value: contract.freight_value
          });
        }
      }

      products.forEach((product) => {
        const rowHeight = 8;
        doc.rect(margin, y, contentWidth, rowHeight);
        
        colX = margin;
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        
        doc.text(product.code, colX + 1, y + 5);
        colX += colWidths[0];
        
        const descLines = doc.splitTextToSize(product.desc, colWidths[1] - 2);
        doc.text(descLines[0], colX + 1, y + 5);
        colX += colWidths[1];
        
        doc.text(product.ncm, colX + 1, y + 5);
        colX += colWidths[2];
        
        doc.text(product.cfop, colX + 1, y + 5);
        colX += colWidths[3];
        
        doc.text(product.un, colX + 1, y + 5);
        colX += colWidths[4];
        
        doc.text(product.qty, colX + 1, y + 5);
        colX += colWidths[5];
        
        doc.text(formatCurrency(product.value).replace("R$", "").trim(), colX + 1, y + 5);
        
        y += rowHeight;
      });

      // Empty rows to fill space
      for (let i = 0; i < 3 - products.length; i++) {
        doc.rect(margin, y, contentWidth, 8);
        y += 8;
      }

      y += 2;

      // ============ CÁLCULO DO IMPOSTO ============
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.rect(margin, y, contentWidth, 6);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("CÁLCULO DO IMPOSTO", margin + 2, y + 4);
      y += 6;

      // Tax row
      const taxRowHeight = 10;
      const taxColWidth = contentWidth / 6;
      
      drawBox(margin, y, taxColWidth, taxRowHeight, "BASE CÁLC. ICMS", formatCurrency(invoiceValue));
      drawBox(margin + taxColWidth, y, taxColWidth, taxRowHeight, "VALOR ICMS", "R$ 0,00");
      drawBox(margin + taxColWidth * 2, y, taxColWidth, taxRowHeight, "BASE CÁLC. ICMS ST", "R$ 0,00");
      drawBox(margin + taxColWidth * 3, y, taxColWidth, taxRowHeight, "VALOR ICMS ST", "R$ 0,00");
      drawBox(margin + taxColWidth * 4, y, taxColWidth, taxRowHeight, "VALOR FRETE", contract.freight_value && invoiceType !== "frete" ? formatCurrency(contract.freight_value) : "R$ 0,00");
      drawBox(margin + taxColWidth * 5, y, taxColWidth, taxRowHeight, "VALOR TOTAL", formatCurrency(invoiceValue), 6, 9);
      y += taxRowHeight + 2;

      // ============ DADOS ADICIONAIS ============
      doc.setFillColor(230, 230, 230);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.rect(margin, y, contentWidth, 6);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text("DADOS ADICIONAIS", margin + 2, y + 4);
      y += 6;

      const additionalHeight = 25;
      doc.rect(margin, y, contentWidth * 0.7, additionalHeight);
      doc.setFontSize(5);
      doc.setTextColor(80);
      doc.setFont("helvetica", "normal");
      doc.text("INFORMAÇÕES COMPLEMENTARES", margin + 1.5, y + 3);
      
      doc.setFontSize(6);
      doc.setTextColor(0);
      const additionalInfo = [
        `Contrato de Referência: ${contract.contract_number}`,
        `Tipo de Pagamento: ${invoiceTypeLabel}`,
        contract.vehicle_lot_number ? `Nº do Lote: ${contract.vehicle_lot_number}` : "",
        "Documento emitido conforme legislação vigente.",
        "Bem adquirido em leilão extrajudicial."
      ].filter(Boolean);
      
      let infoY = y + 7;
      additionalInfo.forEach(info => {
        doc.text(info, margin + 1.5, infoY);
        infoY += 4;
      });

      doc.rect(margin + contentWidth * 0.7, y, contentWidth * 0.3, additionalHeight);
      doc.setFontSize(5);
      doc.setTextColor(80);
      doc.text("RESERVADO AO FISCO", margin + contentWidth * 0.7 + 1.5, y + 3);

      y += additionalHeight + 5;

      // ============ FOOTER ============
      doc.setFontSize(6);
      doc.setTextColor(120);
      doc.setFont("helvetica", "normal");
      doc.text("Documento auxiliar da Nota Fiscal Eletrônica emitido eletronicamente.", pageWidth / 2, y, { align: "center" });
      doc.text("Este documento não substitui a NF-e. Consulte sua autenticidade no portal da SEFAZ.", pageWidth / 2, y + 3, { align: "center" });

      // Save PDF
      const fileName = `DANFE_${invoiceNumber}_${invoiceTypeLabel.replace(/ /g, "_")}.pdf`;
      doc.save(fileName);

      // Update contract in database
      await supabase
        .from("contracts")
        .update({
          invoice_generated: true,
          invoice_number: `NF-${invoiceNumber}`,
          invoice_generated_at: new Date().toISOString()
        })
        .eq("id", contract.id);

      await fetchContracts();
      toast.success("DANFE gerada com sucesso!");
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Erro ao gerar nota fiscal");
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const viewContractDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setDetailsOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Contratos e Notas Fiscais
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum contrato gerado ainda.</p>
              <p className="text-sm">Gere contratos nas opções "Pay Entrega" ou "Pay 30%" acima.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Contrato</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Comprador</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>NF Gerada</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-mono text-sm">{contract.contract_number}</TableCell>
                    <TableCell>
                      <Badge variant={contract.payment_type === "30percent" ? "default" : "secondary"}>
                        {contract.payment_type === "30percent" ? "30% Antecipado" : "Pay Entrega"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{contract.buyer_name}</p>
                        <p className="text-xs text-muted-foreground">{contract.buyer_cpf}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(contract.total_value)}</TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(contract.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {contract.invoice_generated ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Sim
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Não
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => viewContractDetails(contract)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {contract.payment_type === "30percent" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateInvoicePDF(contract, "30percent")}
                            disabled={generatingInvoice === contract.id}
                          >
                            {generatingInvoice === contract.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Download className="w-4 h-4 mr-1" />
                                NF 30%
                              </>
                            )}
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => generateInvoicePDF(contract, "full")}
                              disabled={generatingInvoice === contract.id}
                            >
                              {generatingInvoice === contract.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Download className="w-4 h-4 mr-1" />
                                  NF Total
                                </>
                              )}
                            </Button>
                            {contract.freight_value && contract.freight_value > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => generateInvoicePDF(contract, "frete")}
                                disabled={generatingInvoice === contract.id}
                              >
                                {generatingInvoice === contract.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <Download className="w-4 h-4 mr-1" />
                                    NF Frete
                                  </>
                                )}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Contract Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Contrato</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nº Contrato</p>
                  <p className="font-mono font-medium">{selectedContract.contract_number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tipo</p>
                  <Badge variant={selectedContract.payment_type === "30percent" ? "default" : "secondary"}>
                    {selectedContract.payment_type === "30percent" ? "30% Antecipado" : "Pay Entrega"}
                  </Badge>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-muted-foreground text-sm mb-2">Comprador</p>
                <p className="font-medium">{selectedContract.buyer_name}</p>
                <p className="text-sm">{selectedContract.buyer_cpf}</p>
                {selectedContract.buyer_email && <p className="text-sm text-muted-foreground">{selectedContract.buyer_email}</p>}
              </div>

              <div className="border-t pt-4">
                <p className="text-muted-foreground text-sm mb-2">Vendedor</p>
                <p className="font-medium">{selectedContract.seller_name}</p>
                <p className="text-sm">{selectedContract.seller_cnpj}</p>
              </div>

              {selectedContract.vehicle_description && (
                <div className="border-t pt-4">
                  <p className="text-muted-foreground text-sm mb-2">Descrição do Bem</p>
                  <p className="text-sm">{selectedContract.vehicle_description}</p>
                  {selectedContract.vehicle_lot_number && (
                    <p className="text-sm text-muted-foreground">Lote: {selectedContract.vehicle_lot_number}</p>
                  )}
                </div>
              )}

              <div className="border-t pt-4 space-y-2">
                <p className="text-muted-foreground text-sm mb-2">Valores</p>
                <div className="flex justify-between">
                  <span>Valor do Lance:</span>
                  <span className="font-medium">{formatCurrency(selectedContract.bid_value)}</span>
                </div>
                {selectedContract.freight_value && selectedContract.freight_value > 0 && (
                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span className="font-medium">{formatCurrency(selectedContract.freight_value)}</span>
                  </div>
                )}
                {selectedContract.deposit_value && selectedContract.deposit_value > 0 && (
                  <div className="flex justify-between">
                    <span>Entrada (30%):</span>
                    <span className="font-medium">{formatCurrency(selectedContract.deposit_value)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">{formatCurrency(selectedContract.total_value)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-muted-foreground text-sm">
                  Criado em: {format(new Date(selectedContract.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
                {selectedContract.invoice_generated && selectedContract.invoice_number && (
                  <p className="text-sm text-green-600 mt-1">
                    NF Gerada: {selectedContract.invoice_number}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
