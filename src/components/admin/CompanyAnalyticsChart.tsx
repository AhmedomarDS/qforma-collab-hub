
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface Analytics {
  metric_name: string;
  metric_value: number;
  company_id: string;
  date_recorded: string;
  companies?: {
    company_name: string;
    subdomain: string;
  };
}

interface CompanyAnalyticsChartProps {
  analytics?: Analytics[];
}

export const CompanyAnalyticsChart: React.FC<CompanyAnalyticsChartProps> = ({ analytics = [] }) => {
  // Aggregate metrics by company
  const companyMetrics = analytics.reduce((acc, item) => {
    const companyName = item.companies?.company_name || 'Unknown';
    if (!acc[companyName]) {
      acc[companyName] = {};
    }
    acc[companyName][item.metric_name] = item.metric_value;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Prepare data for charts
  const chartData = Object.entries(companyMetrics).map(([company, metrics]) => ({
    company: company.length > 15 ? company.substring(0, 15) + '...' : company,
    fullCompany: company,
    total_projects: metrics.total_projects || 0,
    total_test_cases: metrics.total_test_cases || 0,
    total_requirements: metrics.total_requirements || 0,
    active_users: metrics.active_users || 0,
    total_defects: metrics.total_defects || 0
  }));

  // Prepare pie chart data for metric distribution
  const metricTotals = analytics.reduce((acc, item) => {
    acc[item.metric_name] = (acc[item.metric_name] || 0) + item.metric_value;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(metricTotals).map(([metric, total]) => ({
    name: metric.replace('total_', '').replace('_', ' '),
    value: total
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Projects and Test Cases by Company */}
      <Card>
        <CardHeader>
          <CardTitle>Projects & Test Cases by Company</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="company" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => {
                  const item = chartData.find(d => d.company === label);
                  return item?.fullCompany || label;
                }}
              />
              <Bar dataKey="total_projects" fill="#8884d8" name="Projects" />
              <Bar dataKey="total_test_cases" fill="#82ca9d" name="Test Cases" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Active Users by Company */}
      <Card>
        <CardHeader>
          <CardTitle>Active Users by Company</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="company" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => {
                  const item = chartData.find(d => d.company === label);
                  return item?.fullCompany || label;
                }}
              />
              <Line type="monotone" dataKey="active_users" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform-wide Metrics Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Platform-wide Metrics Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Requirements vs Defects */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements vs Defects</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="company" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => {
                  const item = chartData.find(d => d.company === label);
                  return item?.fullCompany || label;
                }}
              />
              <Bar dataKey="total_requirements" fill="#82ca9d" name="Requirements" />
              <Bar dataKey="total_defects" fill="#ff7300" name="Defects" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
