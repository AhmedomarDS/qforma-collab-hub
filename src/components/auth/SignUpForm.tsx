
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building } from 'lucide-react';

interface SignUpFormProps {
  onEmailSent: (email: string) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onEmailSent }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeRecaptcha = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', { action: 'submit' })
            .then((token: string) => {
              resolve(token);
            })
            .catch((error: any) => {
              reject(error);
            });
        });
      } else {
        reject(new Error('reCAPTCHA not loaded'));
      }
    });
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
      const recaptchaToken = await executeRecaptcha();
      
      const { error } = await supabase.auth.signUp({
        email,
        password: 'temporary-password',
        options: {
          data: {
            name: name,
            company_name: companyName,
            subdomain: subdomain
          },
          emailRedirectTo: `${window.location.origin}/auth?confirmed=true`,
          captchaToken: recaptchaToken
        }
      });

      if (error) throw error;

      // Store registration data for later use
      localStorage.setItem('registration-data', JSON.stringify({
        email,
        name,
        companyName,
        subdomain
      }));

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

      <div className="mb-4">
        <div 
          className="g-recaptcha" 
          data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          data-size="invisible"
        ></div>
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
  );
};

export default SignUpForm;
