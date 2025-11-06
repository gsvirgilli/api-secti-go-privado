import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonsProps {
  onExportPDF: () => Promise<Blob>;
  onExportExcel: () => Promise<Blob>;
  filename?: string;
  showPDF?: boolean;
  showExcel?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
}

export const ExportButtons = ({
  onExportPDF,
  onExportExcel,
  filename = "relatorio",
  showPDF = true,
  showExcel = true,
  size = "default",
  variant = "outline",
}: ExportButtonsProps) => {
  const { toast } = useToast();
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const downloadFile = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    setLoadingPDF(true);
    try {
      const blob = await onExportPDF();
      downloadFile(blob, `${filename}.pdf`);
      toast({
        title: "PDF gerado com sucesso!",
        description: "O download começará em instantes.",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o relatório em PDF.",
        variant: "destructive",
      });
    } finally {
      setLoadingPDF(false);
    }
  };

  const handleExportExcel = async () => {
    setLoadingExcel(true);
    try {
      const blob = await onExportExcel();
      downloadFile(blob, `${filename}.xlsx`);
      toast({
        title: "Excel gerado com sucesso!",
        description: "O download começará em instantes.",
      });
    } catch (error) {
      console.error("Erro ao gerar Excel:", error);
      toast({
        title: "Erro ao gerar Excel",
        description: "Não foi possível gerar o relatório em Excel.",
        variant: "destructive",
      });
    } finally {
      setLoadingExcel(false);
    }
  };

  return (
    <div className="flex gap-2">
      {showPDF && (
        <Button
          onClick={handleExportPDF}
          disabled={loadingPDF}
          size={size}
          variant={variant}
        >
          {loadingPDF ? (
            <>
              <Download className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Exportar PDF
            </>
          )}
        </Button>
      )}

      {showExcel && (
        <Button
          onClick={handleExportExcel}
          disabled={loadingExcel}
          size={size}
          variant={variant}
        >
          {loadingExcel ? (
            <>
              <Download className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exportar Excel
            </>
          )}
        </Button>
      )}
    </div>
  );
};
