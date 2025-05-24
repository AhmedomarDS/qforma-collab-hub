
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import AuthLayout from './AuthLayout';

interface EmailConfirmationPageProps {
  registeredEmail: string;
  onBackToAuth: () => void;
}

const EmailConfirmationPage: React.FC<EmailConfirmationPageProps> = ({ 
  registeredEmail, 
  onBackToAuth 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

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

  return (
    <AuthLayout title="Check Your Email" subtitle="Check Your Email" showBackButton={false}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-green-100 rounded-full p-3 w-fit">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Registration Confirmation</CardTitle>
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
              <li>Create your password on the next screen</li>
              <li>Sign in with your new credentials</li>
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
              onClick={onBackToAuth} 
              variant="ghost" 
              className="w-full"
            >
              Back to Registration
            </Button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default EmailConfirmationPage;
