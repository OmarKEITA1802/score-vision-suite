import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { Brain, TrendingUp, TrendingDown } from 'lucide-react';

interface ShapChartProps {
  data?: Array<{
    feature: string;
    impact: number;
    frequency: number;
  }>;
  title?: string;
  description?: string;
}

const defaultData = [
  { 
    feature: 'Ratio Revenus/Charges', 
    impact: 0.25, 
    frequency: 95,
    description: 'Impact positif sur l\'approbation'
  },
  { 
    feature: 'Taux d\'endettement', 
    impact: -0.18, 
    frequency: 87,
    description: 'Impact négatif si trop élevé'
  },
  { 
    feature: 'Valeur garantie', 
    impact: 0.15, 
    frequency: 78,
    description: 'Sécurise la décision'
  },
  { 
    feature: 'Historique crédit', 
    impact: 0.12, 
    frequency: 92,
    description: 'Fidélité client'
  },
  { 
    feature: 'Montant demandé', 
    impact: -0.08, 
    frequency: 65,
    description: 'Risque si montant élevé'
  },
  { 
    feature: 'Activité professionnelle', 
    impact: 0.06, 
    frequency: 73,
    description: 'Stabilité de l\'emploi'
  },
];

export const ShapChart: React.FC<ShapChartProps> = ({
  data = defaultData,
  title = 'Analyse SHAP',
  description = 'Impact des variables sur les décisions de crédit'
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-lg max-w-xs">
          <p className="font-medium">{label}</p>
          <p className={`text-sm ${data.impact > 0 ? 'text-success' : 'text-destructive'}`}>
            Impact: {data.impact > 0 ? '+' : ''}{(data.impact * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">
            Fréquence: {data.frequency}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.description}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatXAxisLabel = (value: string) => {
    return value.length > 15 ? value.substring(0, 15) + '...' : value;
  };

  return (
    <Card className="fintech-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <TrendingUp className="h-3 w-3 mr-1 text-success" />
            <span>Impact positif</span>
          </div>
          <div className="flex items-center">
            <TrendingDown className="h-3 w-3 mr-1 text-destructive" />
            <span>Impact négatif</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 5, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number"
                domain={[-0.3, 0.3]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              />
              <YAxis 
                type="category"
                dataKey="feature"
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                width={120}
                tickFormatter={formatXAxisLabel}
              />
              <ReferenceLine x={0} stroke="hsl(var(--border))" strokeWidth={2} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="impact"
                radius={[0, 4, 4, 0]}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.impact > 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Légende et insights */}
        <div className="mt-4 pt-4 border-t space-y-3">
          <div className="text-sm">
            <h4 className="font-medium mb-2">Variables les plus influentes:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {data
                .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
                .slice(0, 4)
                .map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="truncate">{item.feature}</span>
                    <div className="flex items-center ml-2">
                      {item.impact > 0 ? (
                        <TrendingUp className="h-3 w-3 text-success mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                      )}
                      <span className={item.impact > 0 ? 'text-success' : 'text-destructive'}>
                        {Math.abs(item.impact * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};