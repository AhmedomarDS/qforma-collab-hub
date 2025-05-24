
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const Cta = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-6 bg-qforma-blue text-white">
      <div className="container mx-auto text-center max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t('landing.cta.title')}
        </h2>
        <p className="text-xl mb-8 text-blue-100">
          {t('landing.cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-qforma-blue hover:bg-gray-100">
            {t('landing.cta.signIn')}
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-qforma-blue">
            {t('landing.cta.requestDemo')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Cta;
