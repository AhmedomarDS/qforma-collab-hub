
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bug, PlusCircle } from 'lucide-react';

const Defects = () => {
  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Defects</h1>
            <p className="text-muted-foreground">Track and manage defects and issues</p>
          </div>
          <Button className="bg-qforma-blue hover:bg-qforma-blue/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Report New Defect
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <Bug className="h-16 w-16 text-qforma-danger" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Defect Tracking</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              This feature is currently under development. Soon you'll be able to report, track, and resolve defects found during testing.
            </p>
            <Button variant="outline" className="mx-auto">
              <Bug className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Defects;
