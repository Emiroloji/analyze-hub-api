import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Mail, Key } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Profil</h1>
        <p className="text-muted-foreground">Hesap bilgilerinizi görüntüleyin.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hesap Bilgileri</CardTitle>
          <CardDescription>Kayıtlı kullanıcı bilgileriniz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Ad Soyad
            </Label>
            <div className="p-3 rounded-lg border bg-muted/50">
              {user?.name}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <div className="p-3 rounded-lg border bg-muted/50">
              {user?.email}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Kullanıcı ID
            </Label>
            <div className="p-3 rounded-lg border bg-muted/50">
              #{user?.id}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform Özellikleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
            <div>
              <p className="font-medium">Excel & CSV Desteği</p>
              <p className="text-sm text-muted-foreground">
                Excel ve CSV dosyalarınızı yükleyip analiz edin
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
            <div>
              <p className="font-medium">AI Destekli Analiz</p>
              <p className="text-sm text-muted-foreground">
                Verileriniz için detaylı istatistiksel analiz alın
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
            <div>
              <p className="font-medium">Kolon Mapping</p>
              <p className="text-sm text-muted-foreground">
                Veri kolonlarınızı özelleştirin ve eşleştirin
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
            <div>
              <p className="font-medium">Güvenli Depolama</p>
              <p className="text-sm text-muted-foreground">
                Dosyalarınız güvenli bir şekilde saklanır
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
