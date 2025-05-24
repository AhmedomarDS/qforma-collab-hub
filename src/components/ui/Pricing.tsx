
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Pricing = () => {
  const { t } = useTranslation();

  const plans = [
    {
      key: 'free',
      name: t('landing.pricing.plans.free.name'),
      price: 0,
      description: t('landing.pricing.plans.free.description'),
      period: t('landing.pricing.plans.free.period'),
      buttonText: t('landing.pricing.plans.free.buttonText'),
      features: [
        t('landing.pricing.plans.free.features.0'),
        t('landing.pricing.plans.free.features.1'),
        t('landing.pricing.plans.free.features.2'),
        t('landing.pricing.plans.free.features.3'),
      ],
    },
    {
      key: 'pro',
      name: t('landing.pricing.plans.pro.name'),
      price: 29,
      description: t('landing.pricing.plans.pro.description'),
      period: t('landing.pricing.plans.pro.period'),
      buttonText: t('landing.pricing.plans.pro.buttonText'),
      popular: true,
      features: [
        t('landing.pricing.plans.pro.features.0'),
        t('landing.pricing.plans.pro.features.1'),
        t('landing.pricing.plans.pro.features.2'),
        t('landing.pricing.plans.pro.features.3'),
        t('landing.pricing.plans.pro.features.4'),
      ],
    },
    {
      key: 'premium',
      name: t('landing.pricing.plans.premium.name'),
      price: 99,
      description: t('landing.pricing.plans.premium.description'),
      period: t('landing.pricing.plans.premium.period'),
      buttonText: t('landing.pricing.plans.premium.buttonText'),
      features: [
        t('landing.pricing.plans.premium.features.0'),
        t('landing.pricing.plans.premium.features.1'),
        t('landing.pricing.plans.premium.features.2'),
        t('landing.pricing.plans.premium.features.3'),
        t('landing.pricing.plans.premium.features.4'),
      ],
    },
    {
      key: 'enterprise',
      name: t('landing.pricing.plans.enterprise.name'),
      price: t('landing.pricing.plans.enterprise.period'),
      description: t('landing.pricing.plans.enterprise.description'),
      period: '',
      buttonText: t('landing.pricing.plans.enterprise.buttonText'),
      features: [
        t('landing.pricing.plans.enterprise.features.0'),
        t('landing.pricing.plans.enterprise.features.1'),
        t('landing.pricing.plans.enterprise.features.2'),
        t('landing.pricing.plans.enterprise.features.3'),
        t('landing.pricing.plans.enterprise.features.4'),
      ],
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('landing.pricing.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('landing.pricing.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card key={plan.key} className={`relative ${plan.popular ? 'border-qforma-blue shadow-lg' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-qforma-blue">
                  {t('landing.pricing.popular')}
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-qforma-blue">
                  {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                  {plan.period && <span className="text-sm text-muted-foreground">/{plan.period}</span>}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-6" variant={plan.popular ? 'default' : 'outline'}>
                  {plan.buttonText}
                </Button>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
