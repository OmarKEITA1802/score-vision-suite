import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ScoreChartProps {
  data?: Array<{
    month: string;
    averageScore: number;
    applications: number;
  }>;
  title?: string;
  description?: string;
}

const defaultData = [
  { month: 'Jan', averageScore: 65, applications: 12 },
  { month: 'Fév', averageScore: 68, applications: 18 },
  { month: 'Mar', averageScore: 72, applications: 22 },
  { month: 'Avr', averageScore: 69, applications: 15 },
  { month: 'Mai', averageScore: 74, applications: 25 },
  { month: 'Jun', averageScore: 71, applications: 20 },
];

export const ScoreChart: React.FC<ScoreChartProps> = ({
  data = defaultData,
  title = 'Évolution des Scores',
  description = 'Score moyen mensuel des demandes de crédit'
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const formatTooltip = (value: any, name: string) => {
    if (name === 'averageScore') {
      return [`${value}%`, 'Score moyen'];
    }
    return [value, 'Demandes'];
  };

  return (
    <Card className="fintech-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={isMobile ? 10 : 12}
                interval={isMobile ? 1 : 0}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
              />
              <YAxis 
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={isMobile ? 10 : 12}
                tickFormatter={(value) => `${value}%`}
                width={isMobile ? 40 : 60}
              />
              <Tooltip
                formatter={formatTooltip}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="averageScore"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                fill="url(#scoreGradient)"
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Métriques supplémentaires */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">
              {data[data.length - 1]?.averageScore}%
            </p>
            <p className="text-xs text-muted-foreground">Score actuel</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              +{data[data.length - 1]?.averageScore - data[0]?.averageScore}%
            </p>
            <p className="text-xs text-muted-foreground">Progression</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-tertiary">
              {data.reduce((acc, curr) => acc + curr.applications, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total demandes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};