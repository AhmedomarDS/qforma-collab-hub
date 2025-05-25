
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';

const PasswordCreationPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user is already authenticated from the email confirmation
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session in password creation:', session);
      
      if (session?.user) {
        setUserEmail(session.user.email || '');
        setName(session.user.user_metadata?.name || '');
      }
    };

    checkSession();
  }, []);

  const handlePasswordCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword || !name) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update user password and profile
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
        data: { name: name }
      });

      if (updateError) throw updateError;

      toast({
        title: "Account Created Successfully!",
        description: "Your password has been set. Redirecting to dashboard...",
      });

      // Redirect to dashboard after successful password creation
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error: any) {
      console.error('Password creation error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Complete Your Setup" subtitle="Complete Your Setup" showBackButton={false}>
      <Card>
        <CardHeader>
          <div className="mx-auto mb-4 bg-green-100 rounded-full p-3 w-fit">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Email Confirmed!</CardTitle>
          <CardDescription>
            {userEmail && `Welcome ${userEmail}! `}
            Create your password to complete your account setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordCreation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default PasswordCreationPage;
