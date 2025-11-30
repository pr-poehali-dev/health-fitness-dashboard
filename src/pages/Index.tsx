import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

type UserRole = 'client' | 'trainer' | 'landing';

const mockUserData = {
  name: 'Александра Петрова',
  avatar: '',
  goal: 'Похудеть',
  startWeight: 75,
  currentWeight: 68,
  targetWeight: 60,
  startDate: '2024-01-15',
  waterGoal: 8,
  waterCurrent: 5,
  caloriesGoal: 1800,
  caloriesConsumed: 1450,
  proteinGoal: 120,
  proteinConsumed: 95,
  carbsGoal: 180,
  carbsConsumed: 145,
  fatsGoal: 60,
  fatsConsumed: 48,
};

const mockMealPlan = [
  { id: 1, meal: 'Завтрак', time: '08:00', name: 'Овсянка с бананом и орехами', calories: 350, protein: 12, carbs: 52, fats: 10, completed: true },
  { id: 2, meal: 'Перекус', time: '11:00', name: 'Греческий йогурт с ягодами', calories: 180, protein: 15, carbs: 20, fats: 5, completed: true },
  { id: 3, meal: 'Обед', time: '14:00', name: 'Куриная грудка с гречкой и салатом', calories: 520, protein: 45, carbs: 48, fats: 15, completed: true },
  { id: 4, meal: 'Перекус', time: '17:00', name: 'Яблоко и миндаль', calories: 200, protein: 6, carbs: 28, fats: 8, completed: false },
  { id: 5, meal: 'Ужин', time: '19:00', name: 'Запеченная рыба с овощами', calories: 400, protein: 35, carbs: 25, fats: 18, completed: false },
];

const mockWorkoutPlan = [
  { id: 1, exercise: 'Кардио разминка', duration: '10 мин', completed: true },
  { id: 2, exercise: 'Приседания', sets: '4x12', completed: true },
  { id: 3, exercise: 'Жим лежа', sets: '3x10', completed: false },
  { id: 4, exercise: 'Тяга верхнего блока', sets: '3x12', completed: false },
  { id: 5, exercise: 'Планка', duration: '3x60 сек', completed: false },
];

const mockClients = [
  { id: 1, name: 'Александра Петрова', goal: 'Похудеть', progress: 70, lastUpdate: '2 часа назад' },
  { id: 2, name: 'Дмитрий Иванов', goal: 'Набрать массу', progress: 45, lastUpdate: '5 часов назад' },
  { id: 3, name: 'Мария Сидорова', goal: 'Поддержание формы', progress: 85, lastUpdate: '1 день назад' },
];

export default function Index() {
  const [view, setView] = useState<UserRole>('landing');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [waterCount, setWaterCount] = useState(mockUserData.waterCurrent);
  const [meals, setMeals] = useState(mockMealPlan);
  const [workouts, setWorkouts] = useState(mockWorkoutPlan);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{text: string, sender: 'client' | 'trainer'}[]>([
    { text: 'Здравствуйте! Как вы себя чувствуете после вчерашней тренировки?', sender: 'trainer' },
    { text: 'Отлично! Немного болят мышцы, но это приятная боль 💪', sender: 'client' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzingFood, setAnalyzingFood] = useState(false);
  const [foodAnalysis, setFoodAnalysis] = useState<{name: string, calories: number, protein: number, carbs: number, fats: number} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleMeal = (id: number) => {
    setMeals(meals.map(meal => 
      meal.id === id ? { ...meal, completed: !meal.completed } : meal
    ));
  };

  const toggleWorkout = (id: number) => {
    setWorkouts(workouts.map(workout => 
      workout.id === id ? { ...workout, completed: !workout.completed } : workout
    ));
  };

  const addWater = () => {
    if (waterCount < mockUserData.waterGoal) {
      setWaterCount(waterCount + 1);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { text: newMessage, sender: 'client' }]);
      setNewMessage('');
      setTimeout(() => {
        setChatMessages(prev => [...prev, { text: 'Спасибо за информацию! Продолжайте в том же духе 👍', sender: 'trainer' }]);
      }, 1000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setAnalyzingFood(true);
        setTimeout(() => {
          setFoodAnalysis({
            name: 'Куриная грудка с овощами',
            calories: 380,
            protein: 42,
            carbs: 28,
            fats: 8
          });
          setAnalyzingFood(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const viewClientProfile = (clientId: number) => {
    setSelectedClientId(clientId);
    setView('client');
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Icon name="Activity" className="text-white" size={24} />
            </div>
            <span className="text-2xl font-heading font-bold gradient-primary bg-clip-text text-transparent">NutriScan</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setView('client')}>
              <Icon name="User" size={18} className="mr-2" />
              Клиент
            </Button>
            <Button variant="ghost" onClick={() => setView('trainer')}>
              <Icon name="Users" size={18} className="mr-2" />
              Тренер
            </Button>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
            <h1 className="text-6xl font-heading font-bold mb-6 gradient-primary bg-clip-text text-transparent">
              Трансформируй своё здоровье с NutriScan
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Умная платформа для фитнес-центров и медицинских клиник. 
              Персональные планы тренировок и питания с AI-анализом прогресса.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gradient-primary text-white hover:opacity-90" onClick={() => setView('client')}>
                <Icon name="Zap" size={20} className="mr-2" />
                Начать сейчас
              </Button>
              <Button size="lg" variant="outline" onClick={() => setView('trainer')}>
                <Icon name="Users" size={20} className="mr-2" />
                Для специалистов
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16 animate-slide-up">
            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <Icon name="Target" className="text-white" size={24} />
                </div>
                <CardTitle>Персональные цели</CardTitle>
                <CardDescription>
                  Индивидуальные планы под каждого клиента с учетом целей и возможностей
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center mb-4">
                  <Icon name="Camera" className="text-white" size={24} />
                </div>
                <CardTitle>AI распознавание КБЖУ</CardTitle>
                <CardDescription>
                  Сфотографируйте блюдо — получите точный расчет калорий и нутриентов
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300 hover-scale">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-accent flex items-center justify-center mb-4">
                  <Icon name="TrendingUp" className="text-white" size={24} />
                </div>
                <CardTitle>Отслеживание прогресса</CardTitle>
                <CardDescription>
                  Детальная аналитика и визуализация результатов на каждом этапе
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="border-2 glass animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-heading">Возможности платформы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Utensils" className="text-primary" size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Дневник питания</h3>
                    <p className="text-sm text-muted-foreground">
                      Планы питания с отметками выполнения, комментариями и фото блюд
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Icon name="Dumbbell" className="text-secondary" size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Планы тренировок</h3>
                    <p className="text-sm text-muted-foreground">
                      Персональные программы с отслеживанием каждого упражнения
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Icon name="Droplet" className="text-accent" size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Трекер воды</h3>
                    <p className="text-sm text-muted-foreground">
                      Отслеживание гидратации с напоминаниями каждые 250 мл
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Icon name="BarChart" className="text-success" size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Аналитика</h3>
                    <p className="text-sm text-muted-foreground">
                      Графики прогресса, статистика и детальные отчеты
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Users" className="text-primary" size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Панель специалиста</h3>
                    <p className="text-sm text-muted-foreground">
                      Управление всеми клиентами в одном месте для тренеров и врачей
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Icon name="Shield" className="text-secondary" size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Безопасность</h3>
                    <p className="text-sm text-muted-foreground">
                      Защита персональных данных и медицинской информации
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'trainer') {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setView('landing')}>
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <Icon name="Activity" className="text-white" size={18} />
                </div>
                <span className="text-xl font-heading font-bold">Панель тренера</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Icon name="Bell" size={20} />
              </Button>
              <Avatar>
                <AvatarFallback className="gradient-primary text-white font-semibold">ТМ</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2">Мои клиенты</h1>
            <p className="text-muted-foreground">Управляйте прогрессом и планами ваших клиентов</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2">
              <CardHeader>
                <CardDescription>Всего клиентов</CardDescription>
                <CardTitle className="text-4xl gradient-primary bg-clip-text text-transparent">24</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <CardDescription>Активные сегодня</CardDescription>
                <CardTitle className="text-4xl gradient-secondary bg-clip-text text-transparent">18</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <CardDescription>Средний прогресс</CardDescription>
                <CardTitle className="text-4xl text-success">67%</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Список клиентов</CardTitle>
                  <CardDescription>Отслеживайте прогресс каждого клиента</CardDescription>
                </div>
                <Button className="gradient-primary text-white">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить клиента
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockClients.map(client => (
                  <div 
                    key={client.id} 
                    className="p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
                    onClick={() => viewClientProfile(client.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="gradient-primary text-white">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{client.name}</div>
                          <div className="text-sm text-muted-foreground">{client.goal}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{client.lastUpdate}</Badge>
                        <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Прогресс к цели</span>
                        <span className="font-semibold">{client.progress}%</span>
                      </div>
                      <Progress value={client.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setView('landing')}>
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Icon name="Activity" className="text-white" size={18} />
              </div>
              <span className="text-xl font-heading font-bold">NutriScan</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Avatar>
              <AvatarFallback className="gradient-primary text-white font-semibold">АП</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="gradient-primary text-white text-2xl font-bold">АП</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-heading font-bold">{mockUserData.name}</h1>
                <p className="text-muted-foreground">Цель: {mockUserData.goal}</p>
              </div>
            </div>
            {selectedClientId && (
              <Badge variant="secondary" className="text-sm">
                <Icon name="Eye" size={14} className="mr-1" />
                Режим просмотра тренером
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription>Текущий вес</CardDescription>
              <CardTitle className="text-3xl gradient-primary bg-clip-text text-transparent">
                {mockUserData.currentWeight} кг
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription>Целевой вес</CardDescription>
              <CardTitle className="text-3xl text-muted-foreground">
                {mockUserData.targetWeight} кг
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription>Прогресс</CardDescription>
              <CardTitle className="text-3xl text-success">
                {mockUserData.startWeight - mockUserData.currentWeight} кг
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardDescription>До цели</CardDescription>
              <CardTitle className="text-3xl text-accent">
                {mockUserData.currentWeight - mockUserData.targetWeight} кг
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="nutrition" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="nutrition" className="text-base">
              <Icon name="Utensils" size={18} className="mr-2" />
              Питание
            </TabsTrigger>
            <TabsTrigger value="workout" className="text-base">
              <Icon name="Dumbbell" size={18} className="mr-2" />
              Тренировки
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-base">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Прогресс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Нутриенты сегодня</span>
                  <Badge variant="secondary">{mockUserData.caloriesConsumed} / {mockUserData.caloriesGoal} ккал</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Белки</span>
                    <span className="text-sm text-muted-foreground">{mockUserData.proteinConsumed}г / {mockUserData.proteinGoal}г</span>
                  </div>
                  <Progress value={(mockUserData.proteinConsumed / mockUserData.proteinGoal) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Углеводы</span>
                    <span className="text-sm text-muted-foreground">{mockUserData.carbsConsumed}г / {mockUserData.carbsGoal}г</span>
                  </div>
                  <Progress value={(mockUserData.carbsConsumed / mockUserData.carbsGoal) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Жиры</span>
                    <span className="text-sm text-muted-foreground">{mockUserData.fatsConsumed}г / {mockUserData.fatsGoal}г</span>
                  </div>
                  <Progress value={(mockUserData.fatsConsumed / mockUserData.fatsGoal) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Трекер воды</CardTitle>
                  <Badge className="gradient-secondary text-white">
                    {waterCount} / {mockUserData.waterGoal} стаканов
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  {Array.from({ length: mockUserData.waterGoal }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                        i < waterCount
                          ? 'bg-gradient-to-b from-blue-400 to-blue-600 border-blue-600'
                          : 'border-muted-foreground/20'
                      }`}
                    >
                      {i < waterCount && <Icon name="Droplet" className="text-white" size={20} />}
                    </div>
                  ))}
                </div>
                <Button onClick={addWater} disabled={waterCount >= mockUserData.waterGoal} className="w-full gradient-secondary text-white">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Выпить стакан (250 мл)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>План питания</CardTitle>
                    <CardDescription>Отмечайте выполненные приемы пищи</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icon name="Camera" size={16} className="mr-2" />
                    Сфотографировать блюдо
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {uploadedImage && (
                  <Card className="border-2 border-primary/50 bg-primary/5">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Icon name="Sparkles" className="text-primary" size={20} />
                        AI Анализ блюда
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <img src={uploadedImage} alt="Uploaded food" className="w-full h-48 object-cover rounded-lg" />
                      {analyzingFood ? (
                        <div className="text-center py-4">
                          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                          <p className="text-sm text-muted-foreground">Анализирую состав блюда...</p>
                        </div>
                      ) : foodAnalysis && (
                        <div className="space-y-3">
                          <div className="font-semibold text-lg">{foodAnalysis.name}</div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-background rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">Калории</div>
                              <div className="text-xl font-bold gradient-primary bg-clip-text text-transparent">{foodAnalysis.calories} ккал</div>
                            </div>
                            <div className="p-3 bg-background rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">Белки</div>
                              <div className="text-xl font-bold text-success">{foodAnalysis.protein}г</div>
                            </div>
                            <div className="p-3 bg-background rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">Углеводы</div>
                              <div className="text-xl font-bold text-secondary">{foodAnalysis.carbs}г</div>
                            </div>
                            <div className="p-3 bg-background rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">Жиры</div>
                              <div className="text-xl font-bold text-accent">{foodAnalysis.fats}г</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1 gradient-primary text-white">
                              <Icon name="Plus" size={16} className="mr-2" />
                              Добавить в дневник
                            </Button>
                            <Button variant="outline" onClick={() => { setUploadedImage(null); setFoodAnalysis(null); }}>
                              <Icon name="X" size={16} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {meals.map(meal => (
                  <div
                    key={meal.id}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      meal.completed ? 'bg-success/5 border-success/30' : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={meal.completed}
                        onCheckedChange={() => toggleMeal(meal.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <Badge variant="outline" className="mb-2">{meal.meal} • {meal.time}</Badge>
                            <div className={`font-semibold ${meal.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {meal.name}
                            </div>
                          </div>
                          <div className="text-sm font-semibold">{meal.calories} ккал</div>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Б: {meal.protein}г</span>
                          <span>У: {meal.carbs}г</span>
                          <span>Ж: {meal.fats}г</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workout" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>План тренировки на сегодня</CardTitle>
                <CardDescription>Отмечайте выполненные упражнения</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {workouts.map(workout => (
                  <div
                    key={workout.id}
                    className={`p-4 border-2 rounded-xl transition-all ${
                      workout.completed ? 'bg-success/5 border-success/30' : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={workout.completed}
                        onCheckedChange={() => toggleWorkout(workout.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className={`font-semibold ${workout.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {workout.exercise}
                          </div>
                          <Badge variant="secondary">
                            {workout.sets || workout.duration}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                    <Icon name="Plus" className="text-white" size={28} />
                  </div>
                  <h3 className="font-semibold mb-2">Добавить своё упражнение</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Тренер может добавить дополнительные упражнения в ваш план
                  </p>
                  <Button variant="outline" onClick={() => setChatOpen(true)}>
                    <Icon name="MessageSquare" size={16} className="mr-2" />
                    Написать тренеру
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Текущий вес</CardTitle>
                  <CardDescription>Измерено сегодня</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <div className="text-6xl font-heading font-bold gradient-primary bg-clip-text text-transparent">
                      {mockUserData.currentWeight}
                    </div>
                    <div className="text-2xl text-muted-foreground mb-2">кг</div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <Icon name="TrendingDown" className="text-success" size={16} />
                    <span className="text-success font-semibold">
                      -{mockUserData.startWeight - mockUserData.currentWeight} кг за 8 недель
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Прогресс к цели</CardTitle>
                  <CardDescription>До целевого веса</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Выполнено</span>
                      <span className="text-sm font-semibold">
                        {Math.round(((mockUserData.startWeight - mockUserData.currentWeight) / (mockUserData.startWeight - mockUserData.targetWeight)) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={((mockUserData.startWeight - mockUserData.currentWeight) / (mockUserData.startWeight - mockUserData.targetWeight)) * 100} 
                      className="h-3"
                    />
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Осталось сбросить</div>
                    <div className="text-3xl font-bold text-accent">
                      {mockUserData.currentWeight - mockUserData.targetWeight} кг
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Динамика веса</CardTitle>
                <CardDescription>График изменения веса за последние 8 недель</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="relative h-64 border-l-2 border-b-2 border-border rounded-bl-lg p-4">
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pl-2">
                      <span>75 кг</span>
                      <span>70 кг</span>
                      <span>65 кг</span>
                      <span>60 кг</span>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="50%" stopColor="#D946EF" />
                          <stop offset="100%" stopColor="#F97316" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 50 200 L 150 190 L 250 175 L 350 160 L 450 145 L 550 130 L 650 115 L 750 100"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 50 200 L 150 190 L 250 175 L 350 160 L 450 145 L 550 130 L 650 115 L 750 100 L 750 240 L 50 240 Z"
                        fill="url(#areaGradient)"
                      />
                      {[50, 150, 250, 350, 450, 550, 650, 750].map((x, i) => (
                        <circle
                          key={i}
                          cx={x}
                          cy={200 - i * 15}
                          r="5"
                          fill="#8B5CF6"
                          className="animate-scale-in"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="flex justify-between px-8 text-xs text-muted-foreground">
                    {['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4', 'Нед 5', 'Нед 6', 'Нед 7', 'Нед 8'].map((week, i) => (
                      <span key={i}>{week}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Статистика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Дней в программе</span>
                    <span className="font-bold text-xl">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Выполнено тренировок</span>
                    <span className="font-bold text-xl text-success">38</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Соблюдение диеты</span>
                    <span className="font-bold text-xl text-primary">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Средний сон</span>
                    <span className="font-bold text-xl">7.5 ч</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Достижения</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-2">
                        <Icon name="Trophy" className="text-white" size={28} />
                      </div>
                      <div className="text-xs font-medium">7 кг сброшено</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full gradient-secondary flex items-center justify-center mx-auto mb-2">
                        <Icon name="Flame" className="text-white" size={28} />
                      </div>
                      <div className="text-xs font-medium">30 дней подряд</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-success to-accent flex items-center justify-center mx-auto mb-2">
                        <Icon name="Star" className="text-white" size={28} />
                      </div>
                      <div className="text-xs font-medium">100 тренировок</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="max-w-2xl max-h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="MessageSquare" className="text-primary" size={24} />
              Чат с тренером
            </DialogTitle>
            <DialogDescription>
              Обсудите ваш прогресс и задайте вопросы
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4 py-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === 'client'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} className="gradient-primary text-white">
              <Icon name="Send" size={18} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}