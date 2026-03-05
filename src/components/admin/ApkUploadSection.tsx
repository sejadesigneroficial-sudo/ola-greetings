import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Smartphone, Loader2, Trash2, Download, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AppSettings {
  id: string;
  apk_url: string | null;
  apk_version: string | null;
  apk_filename: string | null;
  updated_at: string;
}

export function ApkUploadSection() {
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [uploading, setUploading] = useState(false);
  const [version, setVersion] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAppSettings();
  }, []);

  const fetchAppSettings = async () => {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .single();
    
    if (data) {
      setAppSettings(data);
      setVersion(data.apk_version || "");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.apk')) {
      toast.error("Por favor, selecione um arquivo APK válido");
      return;
    }

    if (!version.trim()) {
      toast.error("Informe a versão do APK antes de fazer upload");
      return;
    }

    setUploading(true);

    try {
      // Delete old APK if exists
      if (appSettings?.apk_filename) {
        await supabase.storage
          .from('app-downloads')
          .remove([appSettings.apk_filename]);
      }

      // Upload new APK
      const filename = `arremate24h-v${version}.apk`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('app-downloads')
        .upload(filename, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('app-downloads')
        .getPublicUrl(filename);

      // Update app_settings
      const { error: updateError } = await supabase
        .from('app_settings')
        .update({
          apk_url: urlData.publicUrl,
          apk_version: version,
          apk_filename: filename,
          updated_at: new Date().toISOString()
        })
        .eq('id', appSettings?.id);

      if (updateError) throw updateError;

      toast.success("APK enviado com sucesso!");
      fetchAppSettings();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error("Erro ao enviar APK: " + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteApk = async () => {
    if (!appSettings?.apk_filename) return;

    try {
      await supabase.storage
        .from('app-downloads')
        .remove([appSettings.apk_filename]);

      await supabase
        .from('app_settings')
        .update({
          apk_url: null,
          apk_version: null,
          apk_filename: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', appSettings.id);

      toast.success("APK removido com sucesso!");
      setVersion("");
      fetchAppSettings();
    } catch (error: any) {
      toast.error("Erro ao remover APK: " + error.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Upload do Aplicativo (APK)
        </CardTitle>
        <CardDescription>
          Faça upload do arquivo APK do aplicativo Android. Este arquivo estará disponível para download pelos usuários.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current APK Status */}
        {appSettings?.apk_url ? (
          <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-success">APK Disponível</p>
                  <p className="text-sm text-muted-foreground">
                    Versão: <span className="font-semibold">{appSettings.apk_version}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Atualizado em: {new Date(appSettings.updated_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={appSettings.apk_url} download>
                    <Download className="w-4 h-4 mr-1" />
                    Baixar
                  </a>
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteApk}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-muted/50 border border-border rounded-lg text-center">
            <Smartphone className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhum APK disponível</p>
            <p className="text-xs text-muted-foreground">Faça upload de um arquivo APK abaixo</p>
          </div>
        )}

        {/* Upload Form */}
        <div className="space-y-4 pt-4 border-t">
          <div>
            <Label htmlFor="apk-version">Versão do APK *</Label>
            <Input
              id="apk-version"
              placeholder="Ex: 1.0.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="max-w-xs"
            />
          </div>

          <div>
            <Label>Arquivo APK</Label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".apk"
                onChange={handleFileUpload}
                className="hidden"
                id="apk-upload"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !version.trim()}
                className="w-full max-w-xs"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Selecionar arquivo APK
                  </>
                )}
              </Button>
              {!version.trim() && (
                <p className="text-xs text-muted-foreground mt-2">
                  Informe a versão antes de fazer upload
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
