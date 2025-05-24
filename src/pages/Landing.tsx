import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  CheckSquare,
  Bug,
  Brain,
  Gauge,
  Palette,
  Globe,
  Smartphone,
  Shield,
  Zap,
} from 'lucide-react';
import AppLayout from '@/components/layouts/AppLayout';
import Hero from '@/components/ui/Hero';
import Pricing from '@/components/ui/Pricing';
import Domain from '@/components/ui/Domain';
import Cta from '@/components/ui/Cta';
import MobileApps from '@/components/ui/MobileApps';

const Landing = () => {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <Hero />

      <Domain />

      <Pricing />

        {/* Features Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">{t('landing.features.title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <FileText className="h-12 w-12 text-qforma-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('landing.features.requirements.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.requirements.description')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <CheckSquare className="h-12 w-12 text-qforma-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('landing.features.testCases.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.testCases.description')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Bug className="h-12 w-12 text-qforma-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('landing.features.defects.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.defects.description')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Brain className="h-12 w-12 text-qforma-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('landing.features.ai.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.ai.description')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Gauge className="h-12 w-12 text-qforma-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('landing.features.performance.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.performance.description')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Palette className="h-12 w-12 text-qforma-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('landing.features.design.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.design.description')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Globe className="h-12 w-12 text-qforma-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('landing.features.browser.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.browser.description')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Smartphone className="h-12 w-12 text-qforma-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('landing.features.mobile.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.mobile.description')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Shield className="h-12 w-12 text-qforma-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('landing.features.security.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.security.description')}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Zap className="h-12 w-12 text-qforma-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('landing.features.integration.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.integration.description')}</p>
              </div>
            </div>
          </div>
        </section>

      <Cta />

      <MobileApps />
    </AppLayout>
  );
};

export default Landing;
