
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-6 text-center bg-gradient-to-br from-qforma-blue to-blue-600 text-white">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {t('landing.hero.title')}
        </h1>
        <p className="text-xl md:text-2xl mb-4 text-blue-100">
          {t('landing.hero.subtitle')}
        </p>
        <p className="text-lg mb-8 text-blue-100">
          {t('landing.hero.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-qforma-blue hover:bg-gray-100">
            {t('common.getStarted')}
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-qforma-blue">
            {t('landing.cta.requestDemo')}
          </Button>
        </div>
        <p className="text-sm mt-4 text-blue-200">
          {t('landing.domain.noCreditCard')}
        </p>
      </div>
    </section>
  );
};

export default Hero;
