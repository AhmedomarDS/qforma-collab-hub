
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface SignUpFormProps {
  onEmailSent: (email: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onEmailSent }) => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const generateSubdomain = (company: string) => {
    return company.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20);
  };

  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
    setSubdomain(generateSubdomain(value));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !companyName || !name || !subdomain) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get the current origin to build the redirect URL
      const origin = window.location.origin;
      const redirectTo = `${origin}/auth`;

      const { error } = await supabase.auth.signUp({
        email,
        password: 'temporary_password', // This will be changed in password creation step
        options: {
          data: {
            name,
            company_name: companyName,
            subdomain: subdomain
          },
          emailRedirectTo: redirectTo
        }
      });

      if (error) throw error;

      toast({
        title: "Registration Started!",
        description: "Please check your email to confirm your account.",
      });

      onEmailSent(email);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Work Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          type="text"
          placeholder="Acme Corporation"
          value={companyName}
          onChange={(e) => handleCompanyNameChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subdomain">Company Subdomain</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="subdomain"
            type="text"
            placeholder="acmecorp"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
            required
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground">.qforma.com</span>
        </div>
        <p className="text-xs text-muted-foreground">
          This will be your company's unique URL
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
};

export default SignUpForm;
