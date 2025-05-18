
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and application settings</p>
          </div>
          <Button className="bg-qforma-blue hover:bg-qforma-blue/90">
            Save Changes
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>User settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="mb-4 flex justify-center">
              <SettingsIcon className="h-16 w-16 text-qforma-blue" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              This feature is currently under development. Soon you'll be able to customize your account settings, notification preferences, and application theme.
            </p>
            <Button variant="outline" className="mx-auto">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Preview Options
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
