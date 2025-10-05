import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { filesAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface File {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

const FileList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await filesAPI.list();
      setFiles(data);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Dosyalar yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      const blob = await filesAPI.download(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'Başarılı',
        description: 'Dosya indirildi',
      });
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Dosya indirilirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (fileId: number) => {
    try {
      await filesAPI.delete(fileId);
      toast({
        title: 'Başarılı',
        description: 'Dosya silindi',
      });
      loadFiles();
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Dosya silinirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dosyalarım</h1>
          <p className="text-muted-foreground">Yüklediğiniz tüm dosyaları görüntüleyin ve yönetin.</p>
        </div>
        <Button onClick={() => navigate('/upload')}>
          Yeni Dosya Yükle
        </Button>
      </div>

      {files.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Henüz dosya yüklemediniz</p>
            <p className="text-muted-foreground mb-6">Başlamak için bir dosya yükleyin</p>
            <Button onClick={() => navigate('/upload')}>
              Dosya Yükle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => (
            <Card key={file.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="line-clamp-1">{file.fileName}</CardTitle>
                <CardDescription>
                  {(file.fileSize / 1024).toFixed(2)} KB • {new Date(file.uploadedAt).toLocaleDateString('tr-TR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/files/${file.id}`)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Görüntüle
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleDownload(file.id, file.fileName)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  İndir
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full justify-start">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sil
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu dosya kalıcı olarak silinecek. Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(file.id)}>
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;
