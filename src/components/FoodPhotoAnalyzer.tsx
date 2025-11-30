import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface FoodData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portion_size?: string;
}

interface FoodPhotoAnalyzerProps {
  onAnalysisComplete: (data: FoodData) => void;
}

export default function FoodPhotoAnalyzer({ onAnalysisComplete }: FoodPhotoAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<FoodData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите изображение',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreviewUrl(base64);
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('https://functions.poehali.dev/027d88c8-dd12-442f-88e1-f99c54dbf703', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка анализа');
      }

      const data: FoodData = await response.json();
      setResult(data);

      toast({
        title: 'Анализ завершен!',
        description: `Распознано: ${data.name}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка анализа',
        description: error instanceof Error ? error.message : 'Не удалось проанализировать фото',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToMeal = () => {
    if (result) {
      onAnalysisComplete(result);
      setPreviewUrl(null);
      setResult(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast({
        title: 'Добавлено в дневник!',
        description: `${result.name} добавлено в план питания`,
      });
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Camera" size={20} />
          AI Распознавание КБЖУ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="food-photo-input"
        />

        {!previewUrl ? (
          <label
            htmlFor="food-photo-input"
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer hover:border-primary transition-all bg-muted/20"
          >
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
              <Icon name="Camera" className="text-white" size={28} />
            </div>
            <div className="text-center">
              <p className="font-semibold mb-1">Сфотографируйте блюдо</p>
              <p className="text-sm text-muted-foreground">
                Нажмите, чтобы выбрать фото
              </p>
            </div>
          </label>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={previewUrl}
                alt="Food preview"
                className="w-full h-64 object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-3" />
                    <p className="font-semibold">Анализирую...</p>
                  </div>
                </div>
              )}
            </div>

            {result && (
              <div className="p-4 rounded-xl bg-success/5 border-2 border-success/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{result.name}</h3>
                  {result.portion_size && (
                    <Badge variant="secondary">{result.portion_size}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-background">
                    <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                      {result.calories}
                    </div>
                    <div className="text-xs text-muted-foreground">ккал</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <div className="text-2xl font-bold text-primary">
                      {result.protein}г
                    </div>
                    <div className="text-xs text-muted-foreground">белки</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <div className="text-2xl font-bold text-secondary">
                      {result.carbs}г
                    </div>
                    <div className="text-xs text-muted-foreground">углеводы</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <div className="text-2xl font-bold text-accent">
                      {result.fats}г
                    </div>
                    <div className="text-xs text-muted-foreground">жиры</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddToMeal}
                    className="flex-1 gradient-primary text-white"
                  >
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить в дневник
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="icon"
                  >
                    <Icon name="X" size={18} />
                  </Button>
                </div>
              </div>
            )}

            {!result && !isAnalyzing && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
              >
                <Icon name="X" size={18} className="mr-2" />
                Отменить
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
