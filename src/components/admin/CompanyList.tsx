
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { 
  Building2, 
  Users, 
  Calendar, 
  DollarSign, 
  MoreHorizontal,
  ExternalLink
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

export const CompanyList: React.FC = () => {
  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Company[];
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      trial: { color: 'bg-blue-100 text-blue-800', label: 'Trial' },
      expired: { color: 'bg-red-100 text-red-800', label: 'Expired' },
      suspended: { color: 'bg-gray-100 text-gray-800', label: 'Suspended' }
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
    return <Badge className={config.color}>{config.label}</Badge>;
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
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Companies ({companies?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Trial Ends</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies?.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{company.company_name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {company.subdomain}.qforma.com
                      </div>
                      <div className="text-xs text-gray-400">{company.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getPlanBadge(company.selected_plan)}</TableCell>
                  <TableCell>{getStatusBadge(company.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(company.created_at), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDistanceToNow(new Date(company.trial_end_date), { addSuffix: true })}
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
