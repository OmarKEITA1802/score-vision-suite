import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface PerformanceChartProps {
  type?: 'bar' | 'pie';
  title?: string;
  description?: string;
}

const barData = [
  { month: 'Jan', approved: 8, rejected: 4, pending: 2 },
  { month: 'Fév', approved: 11, rejected: 5, pending: 2 },
  { month: 'Mar', approved: 14, rejected: 6, pending: 2 },
  { month: 'Avr', approved: 9, rejected: 4, pending: 2 },
  { month: 'Mai', approved: 16, rejected: 7, pending: 2 },
  { month: 'Jun', approved: 12, rejected: 6, pending: 2 },
];

const pieData = [
  { name: 'Approuvés', value: 70, color: 'hsl(var(--success))' },
  { name: 'Refusés', value: 22, color: 'hsl(var(--destructive))' },
  { name: 'En attente', value: 8, color: 'hsl(var(--warning))' },
];

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  type = 'bar',
  title,
  description
}) => {
  const chartTitle = title || (type === 'bar' ? 'Performance Mensuelle' : 'Répartition des Demandes');
  const chartDescription = description || (type === 'bar' ? 
    'Évolution des approbations, rejets et demandes en attente' : 
    'Distribution des statuts de demandes de crédit'
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={barData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Legend />
        <Bar 
          dataKey="approved" 
          name="Approuvés"
          fill="hsl(var(--success))" 
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="rejected" 
          name="Refusés"
          fill="hsl(var(--destructive))" 
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          dataKey="pending" 
          name="En attente"
          fill="hsl(var(--warning))" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <Card className="fintech-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            {type === 'bar' ? (
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            ) : (
              <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
            )}
            {chartTitle}
          </CardTitle>
          <CardDescription>{chartDescription}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {type === 'bar' ? renderBarChart() : renderPieChart()}
        </div>
        
        {/* Métriques résumées */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              {type === 'bar' ? 
                barData.reduce((acc, curr) => acc + curr.approved, 0) : 
                pieData.find(d => d.name === 'Approuvés')?.value || 0
              }{type === 'pie' ? '%' : ''}
            </p>
            <p className="text-xs text-muted-foreground">Approuvés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-destructive">
              {type === 'bar' ? 
                barData.reduce((acc, curr) => acc + curr.rejected, 0) : 
                pieData.find(d => d.name === 'Refusés')?.value || 0
              }{type === 'pie' ? '%' : ''}
            </p>
            <p className="text-xs text-muted-foreground">Refusés</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">
              {type === 'bar' ? 
                barData.reduce((acc, curr) => acc + curr.pending, 0) : 
                pieData.find(d => d.name === 'En attente')?.value || 0
              }{type === 'pie' ? '%' : ''}
            </p>
            <p className="text-xs text-muted-foreground">En attente</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};