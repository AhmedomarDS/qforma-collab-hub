
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import AuthLayout from '@/components/auth/AuthLayout';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import EmailConfirmationPage from '@/components/auth/EmailConfirmationPage';
import PasswordCreationPage from '@/components/auth/PasswordCreationPage';

const Auth = () => {
  const [currentStep, setCurrentStep] = useState('auth');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for email confirmation token in URL hash (Supabase redirects with hash)
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.substring(1)); // Remove the # and parse
    
    const accessToken = urlParams.get('access_token');
    const tokenType = urlParams.get('token_type');
    const type = urlParams.get('type');
    
    // Also check regular search params
    const token = searchParams.get('token');
    const searchType = searchParams.get('type');
    const confirmed = searchParams.get('confirmed');
    
    console.log('Auth page - checking for tokens:', { accessToken, type, token, searchType, confirmed });
    
    if ((accessToken && tokenType === 'bearer' && type === 'signup') || 
        (token && searchType === 'signup') || 
        confirmed === 'true') {
      console.log('Email confirmed, redirecting to password creation');
      setCurrentStep('set-password');
      // Clean up the URL
      window.history.replaceState({}, document.title, '/auth');
    }

    // Handle the session from the URL hash if present
    if (accessToken) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          console.log('Session found after email confirmation:', session);
        }
      });
    }
  }, [searchParams]);

  const handleEmailSent = (email: string) => {
    setRegisteredEmail(email);
    setCurrentStep('email-sent');
  };

  const handleBackToAuth = () => {
    setCurrentStep('auth');
  };

  // Email confirmation sent page
  if (currentStep === 'email-sent') {
    return (
      <EmailConfirmationPage 
        registeredEmail={registeredEmail}
        onBackToAuth={handleBackToAuth}
      />
    );
  }

  // Password creation page
  if (currentStep === 'set-password') {
    return <PasswordCreationPage />;
  }

  // Get the tab from URL params, default to signin for login page
  const activeTab = searchParams.get('tab') || 'signin';

  // Main auth page (sign in / sign up)
  return (
    <AuthLayout title="Welcome to QForma" subtitle="SDLC Platform">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to QForma</CardTitle>
          <CardDescription>
            {activeTab === 'signin' 
              ? 'Sign in to your SDLC Platform account' 
              : 'Create your company account to get started'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => navigate(`/auth?tab=${value}`)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Create Account</TabsTrigger>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <SignInForm />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignUpForm onEmailSent={handleEmailSent} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Auth;
