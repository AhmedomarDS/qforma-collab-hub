
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthLayout from '@/components/auth/AuthLayout';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import EmailConfirmationPage from '@/components/auth/EmailConfirmationPage';
import PasswordCreationPage from '@/components/auth/PasswordCreationPage';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

const Auth = () => {
  const [currentStep, setCurrentStep] = useState('auth');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Load Google reCAPTCHA
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Check for email confirmation token
    const token = searchParams.get('token');
    const type = searchParams.get('type');
    
    if (token && type === 'signup') {
      setCurrentStep('set-password');
    }

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
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

  // Get the tab from URL params
  const activeTab = searchParams.get('tab') || 'signup';

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
