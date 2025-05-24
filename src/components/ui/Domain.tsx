
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Domain = () => {
  const { t } = useTranslation();
  const [company, setCompany] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !subdomain || !email) {
      alert(t('landing.domain.missingFields'));
      return;
    }
    alert(`${t('landing.domain.registrationStarted')} - ${t('landing.domain.settingUp', { plan: 'Free', subdomain })}`);
  };

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {t('landing.domain.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder={t('landing.domain.companyPlaceholder')}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-qforma-blue focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={t('landing.domain.subdomainPlaceholder')}
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-qforma-blue focus:border-transparent"
                />
                <span className="text-gray-500">.qforma.app</span>
              </div>
              <div>
                <input
                  type="email"
                  placeholder={t('landing.domain.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-qforma-blue focus:border-transparent"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                {t('landing.domain.buttonText')}
              </Button>
              <p className="text-sm text-gray-500 text-center">
                {t('landing.domain.noCreditCard')}
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Domain;
