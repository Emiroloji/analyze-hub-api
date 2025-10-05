import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { filesAPI, creditsAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, CreditCard, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    filesCount: 0,
    credits: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [files, credits] = await Promise.all([
        filesAPI.list(),
        creditsAPI.getBalance(),
      ]);
      setStats({
        filesCount: files.length,
        credits: credits.balance,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Hoş Geldiniz, {user?.name}! 👋</h1>
        <p className="text-muted-foreground">AI destekli veri analiz platformunuza hoş geldiniz.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Dosya</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.filesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Yüklenmiş dosyalarınız</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kredi Bakiyesi</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.credits}</div>
            <p className="text-xs text-muted-foreground mt-1">Mevcut krediniz</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analizler</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">Tamamlanan analizler</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
            <CardDescription>Hemen başlamak için aşağıdaki işlemlerden birini seçin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => navigate('/upload')}>
              <Upload className="mr-2 h-4 w-4" />
              Yeni Dosya Yükle
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/files')}>
              <FileText className="mr-2 h-4 w-4" />
              Dosyalarımı Görüntüle
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/credits')}>
              <CreditCard className="mr-2 h-4 w-4" />
              Kredi Yükle
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nasıl Çalışır?</CardTitle>
            <CardDescription>Platform kullanımı için adım adım rehber</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium">Dosya Yükleyin</h4>
                <p className="text-sm text-muted-foreground">Excel, CSV veya PDF dosyanızı yükleyin</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium">Kolonları Eşleştirin</h4>
                <p className="text-sm text-muted-foreground">Veri kolonlarınızı AI için eşleştirin</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium">AI Analizi Başlatın</h4>
                <p className="text-sm text-muted-foreground">Detaylı istatistiksel analiz alın</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
