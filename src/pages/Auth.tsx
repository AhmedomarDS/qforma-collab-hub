
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, CheckCircle, Building } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [invitationToken, setInvitationToken] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for email confirmation or invitation
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    const inviteToken = searchParams.get('invitation');
    
    if (token && type === 'signup') {
      setConfirmationStep(true);
      setConfirmationMessage('Please create your password to complete account setup.');
    }
    
    if (inviteToken) {
      setInvitationToken(inviteToken);
      setConfirmationStep(true);
      setConfirmationMessage('Complete your account setup to join the team.');
    }
  }, [searchParams]);

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
      const token = searchParams.get('token');
      
      if (token) {
        // Verify the token and set password
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup'
        });

        if (verifyError) throw verifyError;

        // Update user password and metadata
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
          data: { name: name }
        });

        if (updateError) throw updateError;

        // Handle invitation if present
        if (invitationToken) {
          const { data, error: inviteError } = await supabase.rpc('accept_invitation', {
            invitation_token: invitationToken,
            user_password: password
          });

          if (inviteError) throw inviteError;
          
          toast({
            title: "Welcome to the team!",
            description: "Your account has been created and you've joined the company.",
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Your account has been successfully created.",
          });
        }

        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !companyName || !subdomain) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create company first
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          company_name: companyName,
          subdomain: subdomain,
          email: email,
          created_by: email // Temporary, will be updated after user creation
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Sign up user
      const { error } = await supabase.auth.signUp({
        email,
        password: 'temp-password', // Will be set during confirmation
        options: {
          data: {
            name: name,
            company_id: company.id
          },
          emailRedirectTo: `${window.location.origin}/auth?confirmed=true`
        }
      });

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: "Please check your email and click the confirmation link to set your password.",
      });
      
      setConfirmationMessage('Please check your email for a confirmation link to complete your registration and set your password.');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (confirmationStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl h-12 w-12 flex items-center justify-center font-bold text-2xl mr-3">
                Q
              </div>
              <div>
                <h1 className="text-2xl font-bold">QForma</h1>
                <p className="text-sm text-muted-foreground">Complete Your Setup</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Set Your Password</CardTitle>
              <CardDescription>{confirmationMessage}</CardDescription>
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
                  <Label htmlFor="password">Password</Label>
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
                  {loading ? 'Setting up account...' : 'Complete Setup'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/landing" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
          
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl h-12 w-12 flex items-center justify-center font-bold text-2xl mr-3">
              Q
            </div>
            <div>
              <h1 className="text-2xl font-bold">QForma</h1>
              <p className="text-sm text-muted-foreground">Quality Assurance Platform</p>
            </div>
          </div>
        </div>

        {confirmationMessage && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {confirmationMessage}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new company account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Company</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Your Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Work Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your work email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      type="text"
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subdomain">Company Subdomain</Label>
                    <div className="flex">
                      <Input
                        id="subdomain"
                        type="text"
                        placeholder="mycompany"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        required
                        className="rounded-r-none"
                      />
                      <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm text-muted-foreground">
                        .qforma.com
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">This will be your team's unique URL</p>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    <Building className="w-4 h-4 mr-2" />
                    {loading ? 'Creating company...' : 'Create Company Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
