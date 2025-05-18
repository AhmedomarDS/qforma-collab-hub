
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckSquare, PlusCircle } from 'lucide-react';

const TestCases = () => {
  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Test Cases</h1>
            <p className="text-muted-foreground">Manage your test cases and executions</p>
          </div>
          <Button className="bg-qforma-blue hover:bg-qforma-blue/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Test Case
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <CheckSquare className="h-16 w-16 text-qforma-teal" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Test Case Management</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              This feature is currently under development. Soon you'll be able to create, manage, and execute test cases linked to requirements.
            </p>
            <Button variant="outline" className="mx-auto">
              <FileText className="h-4 w-4 mr-2" />
              View Requirements
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TestCases;
