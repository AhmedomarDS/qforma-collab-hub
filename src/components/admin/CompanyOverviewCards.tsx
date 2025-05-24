
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface Company {
  id: string;
  company_name: string;
  subdomain: string;
  email: string;
  selected_plan: string;
  status: string;
  trial_start_date: string;
  trial_end_date: string;
  created_at: string;
}

interface Analytics {
  metric_name: string;
  metric_value: number;
  company_id: string;
  date_recorded: string;
}

interface CompanyOverviewCardsProps {
  companies?: Company[];
  totalUsers?: number;
  analytics?: Analytics[];
}

export const CompanyOverviewCards: React.FC<CompanyOverviewCardsProps> = ({
  companies = [],
  totalUsers = 0,
  analytics = []
}) => {
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'active').length;
  const trialCompanies = companies.filter(c => c.status === 'trial').length;
  
  // Calculate total projects across all companies
  const totalProjects = analytics
    .filter(a => a.metric_name === 'total_projects')
    .reduce((sum, a) => sum + a.metric_value, 0);

  const planDistribution = companies.reduce((acc, company) => {
    acc[company.selected_plan] = (acc[company.selected_plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cards = [
    {
      title: 'Total Companies',
      value: totalCompanies,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: `${activeCompanies} active, ${trialCompanies} in trial`
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Across all companies'
    },
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Active projects in platform'
    },
    {
      title: 'Revenue Potential',
      value: `$${(planDistribution.professional || 0) * 29 + (planDistribution.enterprise || 0) * 99}`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Monthly recurring revenue'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-gray-500 mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
