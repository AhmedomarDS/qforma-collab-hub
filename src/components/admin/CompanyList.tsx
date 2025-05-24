
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ExternalLink, 
  Users, 
  Calendar,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface CompanyListProps {
  companies?: Company[];
  isLoading: boolean;
}

export const CompanyList: React.FC<CompanyListProps> = ({ companies = [], isLoading }) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      trial: { color: 'bg-yellow-100 text-yellow-800', label: 'Trial' },
      expired: { color: 'bg-red-100 text-red-800', label: 'Expired' },
      cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.trial;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      free: { color: 'bg-gray-100 text-gray-800', label: 'Free' },
      professional: { color: 'bg-blue-100 text-blue-800', label: 'Professional' },
      enterprise: { color: 'bg-purple-100 text-purple-800', label: 'Enterprise' }
    };
    
    const config = planConfig[plan as keyof typeof planConfig] || planConfig.free;
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>;
  };

  const isTrialExpiringSoon = (trialEndDate: string) => {
    const endDate = new Date(trialEndDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">Loading companies...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Companies ({companies.length})</span>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Export List
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Subdomain</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trial Period</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{company.company_name}</div>
                      <div className="text-sm text-gray-500">{company.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {company.subdomain}.qforma.com
                    </code>
                  </TableCell>
                  <TableCell>{getPlanBadge(company.selected_plan)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(company.status)}
                      {isTrialExpiringSoon(company.trial_end_date) && (
                        <AlertTriangle className="h-4 w-4 text-orange-500" title="Trial expiring soon" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(company.trial_start_date).toLocaleDateString()}</div>
                      <div className="text-gray-500">
                        to {new Date(company.trial_end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDistanceToNow(new Date(company.created_at), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
