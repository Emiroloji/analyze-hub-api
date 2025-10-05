import { useEffect, useState } from 'react';
import { creditsAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Plus, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CreditHistory {
  id: number;
  amount: number;
  type: string;
  createdAt: string;
}

const Credits = () => {
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<CreditHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadCreditsData();
  }, []);

  const loadCreditsData = async () => {
    try {
      const [balanceData, historyData] = await Promise.all([
        creditsAPI.getBalance(),
        creditsAPI.getHistory(),
      ]);
      setBalance(balanceData.balance);
      setHistory(historyData);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Kredi bilgileri yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredits = async () => {
    const amount = parseInt(addAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Hata',
        description: 'Geçerli bir miktar girin',
        variant: 'destructive',
      });
      return;
    }

    setAdding(true);
    try {
      await creditsAPI.add(amount);
      toast({
        title: 'Başarılı',
        description: `${amount} kredi eklendi`,
      });
      setAddAmount('');
      loadCreditsData();
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Kredi eklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
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
      <div>
        <h1 className="text-4xl font-bold mb-2">Kredi Yönetimi</h1>
        <p className="text-muted-foreground">Kredi bakiyenizi görüntüleyin ve yönetin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Mevcut Bakiye
            </CardTitle>
            <CardDescription>Kullanılabilir kredi miktarınız</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold gradient-text">{balance}</p>
            <p className="text-sm text-muted-foreground mt-2">Kredi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kredi Ekle</CardTitle>
            <CardDescription>Hesabınıza yeni kredi ekleyin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Miktar</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                placeholder="Eklenecek kredi miktarı"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setAddAmount('5')} variant="outline">
                5
              </Button>
              <Button onClick={() => setAddAmount('10')} variant="outline">
                10
              </Button>
              <Button onClick={() => setAddAmount('25')} variant="outline">
                25
              </Button>
              <Button onClick={() => setAddAmount('50')} variant="outline">
                50
              </Button>
            </div>
            <Button onClick={handleAddCredits} disabled={adding} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {adding ? 'Ekleniyor...' : 'Kredi Ekle'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kredi Geçmişi</CardTitle>
          <CardDescription>Tüm kredi hareketleriniz</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8">
              <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Henüz işlem geçmişi yok</p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead className="text-right">Miktar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleString('tr-TR')}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.type === 'ANALYSIS' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
                        }`}>
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        item.amount < 0 ? 'text-destructive' : 'text-success'
                      }`}>
                        {item.amount > 0 ? '+' : ''}{item.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bilgi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <span className="text-primary">•</span>
            <p className="text-sm text-muted-foreground">
              Her AI analizi için 1 kredi harcanır
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary">•</span>
            <p className="text-sm text-muted-foreground">
              Krediler asla sona ermez
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-primary">•</span>
            <p className="text-sm text-muted-foreground">
              İstediğiniz zaman kredi ekleyebilirsiniz
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Credits;
