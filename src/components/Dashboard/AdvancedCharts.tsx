import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Treemap,
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity,
  Download,
  Maximize2,
  RefreshCw
} from 'lucide-react';

// Données simulées plus riches
const timeSeriesData = [
  { date: '2024-01', applications: 45, approved: 32, rejected: 13, avgScore: 72, volume: 1200000 },
  { date: '2024-02', applications: 52, approved: 38, rejected: 14, avgScore: 74, volume: 1450000 },
  { date: '2024-03', applications: 48, approved: 35, rejected: 13, avgScore: 73, volume: 1380000 },
  { date: '2024-04', applications: 61, approved: 44, rejected: 17, avgScore: 75, volume: 1620000 },
  { date: '2024-05', applications: 58, approved: 42, rejected: 16, avgScore: 76, volume: 1580000 },
  { date: '2024-06', applications: 65, approved: 48, rejected: 17, avgScore: 78, volume: 1720000 },
];

const riskDistributionData = [
  { risk: 'Très faible', count: 45, percentage: 28, color: '#22c55e' },
  { risk: 'Faible', count: 52, percentage: 32, color: '#84cc16' },
  { risk: 'Moyen', count: 38, percentage: 24, color: '#eab308' },
  { risk: 'Élevé', count: 20, percentage: 12, color: '#f97316' },
  { risk: 'Très élevé', count: 7, percentage: 4, color: '#ef4444' },
];

const performanceByAgentData = [
  { agent: 'Marie Dupont', applications: 28, approved: 24, rejectionRate: 14, avgProcessingTime: 2.3, score: 92 },
  { agent: 'Jean Martin', applications: 32, approved: 26, rejectionRate: 19, avgProcessingTime: 3.1, score: 88 },
  { agent: 'Sophie Bernard', applications: 25, approved: 22, rejectionRate: 12, avgProcessingTime: 2.1, score: 94 },
  { agent: 'Pierre Moreau', applications: 30, approved: 21, rejectionRate: 30, avgProcessingTime: 3.8, score: 82 },
  { agent: 'Lucie Petit', applications: 27, approved: 23, rejectionRate: 15, avgProcessingTime: 2.5, score: 90 },
];

const sectorAnalysisData = [
  { sector: 'Commerce', applications: 45, avgScore: 75, approvalRate: 78, avgAmount: 85000 },
  { sector: 'Services', applications: 38, avgScore: 72, approvalRate: 71, avgAmount: 92000 },
  { sector: 'Industrie', applications: 32, avgScore: 78, approvalRate: 84, avgAmount: 145000 },
  { sector: 'Agriculture', applications: 18, avgScore: 69, approvalRate: 67, avgAmount: 120000 },
  { sector: 'BTP', applications: 25, avgScore: 71, approvalRate: 68, avgAmount: 110000 },
  { sector: 'Tech', applications: 22, avgScore: 81, approvalRate: 91, avgAmount: 75000 },
];

const radarData = [
  { metric: 'Revenus', current: 85, benchmark: 78 },
  { metric: 'Solvabilité', current: 92, benchmark: 85 },
  { metric: 'Historique', current: 78, benchmark: 82 },
  { metric: 'Garanties', current: 88, benchmark: 79 },
  { metric: 'Stabilité', current: 82, benchmark: 81 },
  { metric: 'Croissance', current: 76, benchmark: 73 },
];

const chartConfig = {
  applications: { label: 'Demandes', color: 'hsl(var(--chart-primary))' },
  approved: { label: 'Approuvées', color: 'hsl(var(--chart-secondary))' },
  rejected: { label: 'Rejetées', color: 'hsl(var(--destructive))' },
  avgScore: { label: 'Score moyen', color: 'hsl(var(--chart-tertiary))' },
  volume: { label: 'Volume', color: 'hsl(var(--chart-quaternary))' },
  current: { label: 'Actuel', color: 'hsl(var(--chart-primary))' },
  benchmark: { label: 'Référence', color: 'hsl(var(--chart-secondary))' },
};

export const AdvancedCharts: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState('applications');
  const [chartType, setChartType] = useState('line');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.dataKey}: {entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Contrôles globaux */}
      <Card className="fintech-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tableaux de bord avancés
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border z-50">
                  <SelectItem value="1m">1 mois</SelectItem>
                  <SelectItem value="3m">3 mois</SelectItem>
                  <SelectItem value="6m">6 mois</SelectItem>
                  <SelectItem value="1y">1 an</SelectItem>
                  <SelectItem value="all">Tout</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Analyse des risques</TabsTrigger>
          <TabsTrigger value="sectors">Secteurs</TabsTrigger>
          <TabsTrigger value="radar">Vue 360°</TabsTrigger>
        </TabsList>

        {/* Onglet Tendances */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card className="fintech-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Croissance mensuelle</p>
                    <p className="text-2xl font-bold text-success">+18.5%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="fintech-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Taux d'approbation</p>
                    <p className="text-2xl font-bold text-primary">73.8%</p>
                  </div>
                  <Badge variant="secondary" className="text-primary">+2.3%</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="fintech-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Volume total</p>
                    <p className="text-2xl font-bold">{formatCurrency(8950000)}</p>
                  </div>
                  <Activity className="h-8 w-8 text-chart-tertiary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="fintech-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Évolution temporelle</CardTitle>
                <div className="flex gap-2">
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border z-50">
                      <SelectItem value="line">Ligne</SelectItem>
                      <SelectItem value="area">Zone</SelectItem>
                      <SelectItem value="bar">Barres</SelectItem>
                      <SelectItem value="composed">Combiné</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' && (
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="applications" stroke="var(--color-applications)" strokeWidth={2} />
                      <Line type="monotone" dataKey="approved" stroke="var(--color-approved)" strokeWidth={2} />
                      <Line type="monotone" dataKey="rejected" stroke="var(--color-rejected)" strokeWidth={2} />
                    </LineChart>
                  )}
                  {chartType === 'area' && (
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Area type="monotone" dataKey="approved" stackId="1" stroke="var(--color-approved)" fill="var(--color-approved)" fillOpacity={0.7} />
                      <Area type="monotone" dataKey="rejected" stackId="1" stroke="var(--color-rejected)" fill="var(--color-rejected)" fillOpacity={0.7} />
                    </AreaChart>
                  )}
                  {chartType === 'bar' && (
                    <BarChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="applications" fill="var(--color-applications)" />
                      <Bar dataKey="approved" fill="var(--color-approved)" />
                      <Bar dataKey="rejected" fill="var(--color-rejected)" />
                    </BarChart>
                  )}
                  {chartType === 'composed' && (
                    <ComposedChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar yAxisId="left" dataKey="applications" fill="var(--color-applications)" />
                      <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="var(--color-avgScore)" strokeWidth={3} />
                    </ComposedChart>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Performance */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Performance par agent</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={performanceByAgentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                    <XAxis dataKey="applications" name="Demandes traitées" />
                    <YAxis dataKey="score" name="Score de performance" />
                    <ChartTooltip content={<CustomTooltip />} />
                    <Scatter dataKey="score" fill="var(--color-applications)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analyse des risques */}
        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Distribution des risques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ risk, percentage }) => `${risk}: ${percentage}%`}
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardHeader>
                <CardTitle>Métriques de risque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskDistributionData.map((risk) => (
                  <div key={risk.risk} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: risk.color }}
                      />
                      <span className="font-medium">{risk.risk}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{risk.count}</div>
                      <div className="text-sm text-muted-foreground">{risk.percentage}%</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Secteurs */}
        <TabsContent value="sectors" className="space-y-4">
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Analyse sectorielle</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" />
                    <XAxis dataKey="sector" />
                    <YAxis />
                    <ChartTooltip content={<CustomTooltip />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="applications" fill="var(--color-applications)" />
                    <Bar dataKey="avgScore" fill="var(--color-avgScore)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Vue 360° */}
        <TabsContent value="radar" className="space-y-4">
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Vue 360° - Performance vs Benchmark</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--chart-grid))" />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Actuel"
                      dataKey="current"
                      stroke="var(--color-current)"
                      fill="var(--color-current)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Référence"
                      dataKey="benchmark"
                      stroke="var(--color-benchmark)"
                      fill="var(--color-benchmark)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};