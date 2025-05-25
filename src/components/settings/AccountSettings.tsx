
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

const AccountSettings = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Update your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Photo */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.user_metadata?.avatar} alt={user?.user_metadata?.name || user?.email} />
            <AvatarFallback className="text-lg">{user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium mb-1">Profile Photo</h3>
            <p className="text-sm text-muted-foreground mb-3">This will be displayed on your profile</p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">Upload new photo</Button>
              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">Remove</Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue={user?.user_metadata?.name} placeholder="Enter your full name" />
            </div>
            
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" defaultValue={user?.user_metadata?.name} placeholder="Enter your display name" />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} placeholder="Enter your email" />
            </div>
            
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input id="jobTitle" defaultValue="Tester" placeholder="Enter your job title" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Company Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Company Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" defaultValue="QForma Technologies" placeholder="Enter company name" />
            </div>
            
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" defaultValue="Quality Assurance" placeholder="Enter your department" />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Input id="companyAddress" placeholder="Enter company address" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
