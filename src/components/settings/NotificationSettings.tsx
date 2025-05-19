import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  SendHorizontal,
  Mail, 
  Send,
  Settings,
  Smartphone
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const { toast } = useToast();
  
  const [notificationChannels, setNotificationChannels] = useState({
    email: {
      enabled: true,
      address: 'user@example.com',
      verified: true
    },
    whatsapp: {
      enabled: false,
      number: '',
      verified: false
    },
    telegram: {
      enabled: false,
      username: '',
      verified: false
    }
  });
  
  const [notificationTypes, setNotificationTypes] = useState({
    requirements: true,
    testCases: true,
    defects: true,
    tasks: true,
    projects: true,
    mentions: true,
    system: true
  });

  const toggleChannel = (channel: keyof typeof notificationChannels) => {
    setNotificationChannels(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        enabled: !prev[channel].enabled
      }
    }));
  };

  const updateChannelInfo = (channel: keyof typeof notificationChannels, field: string, value: string) => {
    setNotificationChannels(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [field]: value
      }
    }));
  };

  const toggleNotificationType = (type: keyof typeof notificationTypes) => {
    setNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleVerification = (channel: keyof typeof notificationChannels) => {
    // In a real application, we would send a verification code here
    toast({
      title: "Verification code sent",
      description: `We've sent a verification code to your ${channel}. Please check and enter the code.`,
    });

    // Simulate successful verification after delay
    setTimeout(() => {
      setNotificationChannels(prev => ({
        ...prev,
        [channel]: {
          ...prev[channel],
          verified: true
        }
      }));

      toast({
        title: "Verified successfully",
        description: `Your ${channel} has been verified.`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>Configure how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-md">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
              </div>
              <Switch 
                checked={notificationChannels.email.enabled} 
                onCheckedChange={() => toggleChannel('email')}
              />
            </div>
            
            {notificationChannels.email.enabled && (
              <div className="pl-14 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      value={notificationChannels.email.address}
                      onChange={(e) => updateChannelInfo('email', 'address', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="flex items-end">
                    {notificationChannels.email.verified ? (
                      <span className="text-sm text-green-600 font-medium">✓ Verified</span>
                    ) : (
                      <Button 
                        variant="outline"
                        onClick={() => handleVerification('email')}
                      >
                        Verify Email
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />
          
          {/* WhatsApp Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-2 rounded-md">
                  <Smartphone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">WhatsApp Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp</p>
                </div>
              </div>
              <Switch 
                checked={notificationChannels.whatsapp.enabled}
                onCheckedChange={() => toggleChannel('whatsapp')}
              />
            </div>
            
            {notificationChannels.whatsapp.enabled && (
              <div className="pl-14 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="col-span-2">
                    <Label htmlFor="whatsapp">Phone Number</Label>
                    <Input 
                      id="whatsapp" 
                      value={notificationChannels.whatsapp.number}
                      onChange={(e) => updateChannelInfo('whatsapp', 'number', e.target.value)}
                      placeholder="Enter your phone number with country code"
                    />
                  </div>
                  <div className="flex items-end">
                    {notificationChannels.whatsapp.verified ? (
                      <span className="text-sm text-green-600 font-medium">✓ Verified</span>
                    ) : (
                      <Button 
                        variant="outline"
                        onClick={() => handleVerification('whatsapp')}
                      >
                        Verify Number
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />
          
          {/* Telegram Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-sky-100 p-2 rounded-md">
                  <SendHorizontal className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Telegram Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications via Telegram</p>
                </div>
              </div>
              <Switch 
                checked={notificationChannels.telegram.enabled}
                onCheckedChange={() => toggleChannel('telegram')}
              />
            </div>
            
            {notificationChannels.telegram.enabled && (
              <div className="pl-14 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="col-span-2">
                    <Label htmlFor="telegram">Telegram Username</Label>
                    <Input 
                      id="telegram" 
                      value={notificationChannels.telegram.username}
                      onChange={(e) => updateChannelInfo('telegram', 'username', e.target.value)}
                      placeholder="Enter your Telegram username"
                    />
                  </div>
                  <div className="flex items-end">
                    {notificationChannels.telegram.verified ? (
                      <span className="text-sm text-green-600 font-medium">✓ Verified</span>
                    ) : (
                      <Button 
                        variant="outline"
                        onClick={() => handleVerification('telegram')}
                      >
                        Connect Telegram
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose what types of notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="requirements">Requirements Updates</Label>
              </div>
              <Switch 
                id="requirements" 
                checked={notificationTypes.requirements} 
                onCheckedChange={() => toggleNotificationType('requirements')}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="testCases">Test Cases Updates</Label>
              </div>
              <Switch 
                id="testCases" 
                checked={notificationTypes.testCases} 
                onCheckedChange={() => toggleNotificationType('testCases')}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="defects">Defect Reports</Label>
              </div>
              <Switch 
                id="defects" 
                checked={notificationTypes.defects} 
                onCheckedChange={() => toggleNotificationType('defects')}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="tasks">Task Assignments</Label>
              </div>
              <Switch 
                id="tasks" 
                checked={notificationTypes.tasks} 
                onCheckedChange={() => toggleNotificationType('tasks')}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="projects">Project Updates</Label>
              </div>
              <Switch 
                id="projects" 
                checked={notificationTypes.projects} 
                onCheckedChange={() => toggleNotificationType('projects')}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="mentions">Mentions & Comments</Label>
              </div>
              <Switch 
                id="mentions" 
                checked={notificationTypes.mentions} 
                onCheckedChange={() => toggleNotificationType('mentions')}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="system">System Notifications</Label>
              </div>
              <Switch 
                id="system" 
                checked={notificationTypes.system} 
                onCheckedChange={() => toggleNotificationType('system')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
