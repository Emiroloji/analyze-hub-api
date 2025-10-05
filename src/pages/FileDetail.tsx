import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { filesAPI, mappingAPI, aiAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Sparkles, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Mapping {
  id: number;
  sourceColumn: string;
  targetField: string;
}

const FileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<any>(null);
  const [mappings, setMappings] = useState<Mapping[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [newMapping, setNewMapping] = useState({ sourceColumn: '', targetField: '' });

  useEffect(() => {
    loadFileData();
  }, [id]);

  const loadFileData = async () => {
    try {
      const [previewData, mappingsData] = await Promise.all([
        filesAPI.preview(Number(id)),
        mappingAPI.list(Number(id)),
      ]);
      setPreview(previewData);
      setMappings(mappingsData);
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Dosya verileri yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMapping = async () => {
    if (!newMapping.sourceColumn || !newMapping.targetField) {
      toast({
        title: 'Hata',
        description: 'Lütfen tüm alanları doldurun',
        variant: 'destructive',
      });
      return;
    }

    try {
      await mappingAPI.create(Number(id), newMapping);
      toast({
        title: 'Başarılı',
        description: 'Mapping eklendi',
      });
      setNewMapping({ sourceColumn: '', targetField: '' });
      loadFileData();
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Mapping eklenirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAllMappings = async () => {
    try {
      await mappingAPI.delete(Number(id));
      toast({
        title: 'Başarılı',
        description: 'Tüm mappingler silindi',
      });
      loadFileData();
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Mappingler silinirken bir hata oluştu',
        variant: 'destructive',
      });
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await aiAPI.analyze(Number(id));
      setAnalysisResult(result);
      toast({
        title: 'Başarılı',
        description: 'Analiz tamamlandı!',
      });
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.response?.data?.message || 'Analiz sırasında bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/files')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-4xl font-bold">Dosya Detayları</h1>
          <p className="text-muted-foreground">Dosyanızı önizleyin, mapping yapın ve analiz edin</p>
        </div>
      </div>

      <Tabs defaultValue="preview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="preview">Önizleme</TabsTrigger>
          <TabsTrigger value="mapping">Mapping</TabsTrigger>
          <TabsTrigger value="analysis">Analiz</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dosya Önizleme</CardTitle>
              <CardDescription>İlk birkaç satır</CardDescription>
            </CardHeader>
            <CardContent>
              {preview && (
                <div className="rounded-lg border overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {preview.columns.map((col: string) => (
                          <TableHead key={col}>{col}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.sample.map((row: any, idx: number) => (
                        <TableRow key={idx}>
                          {preview.columns.map((col: string) => (
                            <TableCell key={col}>{row[col]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kolon Eşlemeleri</CardTitle>
              <CardDescription>AI analizi için veri kolonlarınızı eşleştirin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kaynak Kolon</Label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newMapping.sourceColumn}
                    onChange={(e) => setNewMapping({ ...newMapping, sourceColumn: e.target.value })}
                  >
                    <option value="">Seçin</option>
                    {preview?.columns.map((col: string) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Hedef Alan</Label>
                  <Input
                    placeholder="Örn: item_name, price, quantity"
                    value={newMapping.targetField}
                    onChange={(e) => setNewMapping({ ...newMapping, targetField: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddMapping}>
                  <Plus className="mr-2 h-4 w-4" />
                  Mapping Ekle
                </Button>
                {mappings.length > 0 && (
                  <Button variant="destructive" onClick={handleDeleteAllMappings}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Tümünü Sil
                  </Button>
                )}
              </div>

              {mappings.length > 0 && (
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kaynak Kolon</TableHead>
                        <TableHead>Hedef Alan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mappings.map((mapping) => (
                        <TableRow key={mapping.id}>
                          <TableCell className="font-medium">{mapping.sourceColumn}</TableCell>
                          <TableCell>{mapping.targetField}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Analizi</CardTitle>
              <CardDescription>Dosyanız için detaylı istatistiksel analiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!analysisResult ? (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analiz Başlatın</h3>
                  <p className="text-muted-foreground mb-6">
                    AI destekli analiz için 1 kredi harcanacaktır
                  </p>
                  <Button onClick={handleAnalyze} disabled={analyzing}>
                    {analyzing ? 'Analiz ediliyor...' : 'Analizi Başlat'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Toplam Satır</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{analysisResult.row_count}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Toplam Kolon</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{analysisResult.columns.length}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>İstatistiksel Özet</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(analysisResult.describe).map(([key, value]: [string, any]) => (
                          <div key={key} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">{key}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              {Object.entries(value).map(([stat, val]: [string, any]) => (
                                <div key={stat}>
                                  <span className="text-muted-foreground">{stat}:</span>{' '}
                                  <span className="font-medium">{typeof val === 'number' ? val.toFixed(2) : val}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Veri Önizleme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border overflow-auto max-h-96">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {analysisResult.columns.map((col: string) => (
                                <TableHead key={col}>{col}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {analysisResult.data.slice(0, 10).map((row: any, idx: number) => (
                              <TableRow key={idx}>
                                {analysisResult.columns.map((col: string) => (
                                  <TableCell key={col}>{row[col]}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileDetail;
