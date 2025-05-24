
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Analytics {
  metric_name: string;
  metric_value: number;
  company_id: string;
  date_recorded: string;
}

interface CompanyAnalyticsChartProps {
  analytics?: Analytics[];
}

export const CompanyAnalyticsChart: React.FC<CompanyAnalyticsChartProps> = ({
  analytics = []
}) => {
  // Group analytics by metric and sum values
  const chartData = analytics.reduce((acc, item) => {
    const existing = acc.find(entry => entry.name === item.metric_name);
    if (existing) {
      existing.value += item.metric_value;
    } else {
      acc.push({
        name: item.metric_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: item.metric_value
      });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Sample growth data for the line chart
  const growthData = [
    { month: 'Jan', companies: 12, users: 45 },
    { month: 'Feb', companies: 18, users: 72 },
    { month: 'Mar', companies: 25, users: 98 },
    { month: 'Apr', companies: 32, users: 134 },
    { month: 'May', companies: 38, users: 167 },
    { month: 'Jun', companies: 45, users: 203 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Platform Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Growth Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="companies" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
