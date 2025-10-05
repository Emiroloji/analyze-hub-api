import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { filesAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FileUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'Hata',
        description: 'Lütfen bir dosya seçin',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const result = await filesAPI.upload(file);
      toast({
        title: 'Başarılı',
        description: 'Dosya başarıyla yüklendi!',
      });
      navigate(`/files/${result.id}`);
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.response?.data?.message || 'Dosya yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dosya Yükle</h1>
        <p className="text-muted-foreground">Excel, CSV veya PDF dosyanızı yükleyin ve AI analizine başlayın.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dosya Seç</CardTitle>
          <CardDescription>Desteklenen formatlar: .xlsx, .xls, .csv, .pdf</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">Dosya</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls,.csv,.pdf"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          {file && (
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
          )}

          <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Yükleniyor...' : 'Dosyayı Yükle'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Önemli Bilgiler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <span className="text-primary">•</span>
            <p className="text-sm text-muted-foreground">
              Excel ve CSV dosyaları için AI analizi yapılabilir
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary">•</span>
            <p className="text-sm text-muted-foreground">
              PDF dosyaları sadece saklama için yüklenebilir
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary">•</span>
            <p className="text-sm text-muted-foreground">
              Her analiz için 1 kredi harcanır
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary">•</span>
            <p className="text-sm text-muted-foreground">
              Dosya yüklendikten sonra kolon eşlemeleri yapabilirsiniz
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
