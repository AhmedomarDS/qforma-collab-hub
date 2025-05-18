
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Download } from 'lucide-react';

const Reports = () => {
  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate and view project reports and metrics</p>
          </div>
          <Button className="bg-qforma-blue hover:bg-qforma-blue/90">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <BarChart className="h-16 w-16 text-qforma-blue" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Advanced Reporting</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              This feature is currently under development. Soon you'll be able to generate comprehensive reports on test coverage, defect trends, and project progress.
            </p>
            <Button variant="outline" className="mx-auto">
              <BarChart className="h-4 w-4 mr-2" />
              Preview Sample Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
