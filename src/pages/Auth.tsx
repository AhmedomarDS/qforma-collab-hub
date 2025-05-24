
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
import { Eye, EyeOff, ArrowLeft, CheckCircle, Building, Mail } from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState('auth'); // 'auth', 'email-sent', 'set-password'
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for email confirmation token
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type === 'signup') {
      setCurrentStep('set-password');
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

        toast({
          title: "Account Created Successfully!",
          description: "Your password has been set. You can now sign in.",
        });

        // Redirect to sign in
        setCurrentStep('auth');
        navigate('/auth');
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
      // Sign up user - this will send confirmation email
      const { error } = await supabase.auth.signUp({
        email,
        password: 'temporary-password', // Will be set during confirmation
        options: {
          data: {
            name: name,
            company_name: companyName,
            subdomain: subdomain
          },
          emailRedirectTo: `${window.location.origin}/auth?confirmed=true`
        }
      });

      if (error) throw error;

      setRegisteredEmail(email);
      setCurrentStep('email-sent');
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

  const handleResendEmail = async () => {
    if (!registeredEmail) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: registeredEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?confirmed=true`
        }
      });

      if (error) throw error;

      toast({
        title: "Email Resent",
        description: "Please check your inbox for the confirmation email.",
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Email confirmation sent page
  if (currentStep === 'email-sent') {
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
                <p className="text-sm text-muted-foreground">Check Your Email</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 bg-green-100 rounded-full p-3 w-fit">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Check Your Inbox</CardTitle>
              <CardDescription>
                We've sent a confirmation email to <strong>{registeredEmail}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the confirmation link in the email</li>
                  <li>Create your password</li>
                  <li>Start using QForma</li>
                </ol>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <Button 
                  onClick={handleResendEmail} 
                  variant="outline" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Resending...' : 'Resend Confirmation Email'}
                </Button>
                
                <Button 
                  onClick={() => setCurrentStep('auth')} 
                  variant="ghost" 
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Password creation page
  if (currentStep === 'set-password') {
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
              <div className="mx-auto mb-4 bg-green-100 rounded-full p-3 w-fit">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Email Confirmed!</CardTitle>
              <CardDescription>Create your password to complete your account setup</CardDescription>
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
        </div>
      </div>
    );
  }

  // Main auth page (sign in / sign up)
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
