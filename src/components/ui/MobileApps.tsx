
import React from 'react';
import { useTranslation } from 'react-i18next';

const MobileApps = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">{t('landing.mobileApps.title')}</h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://apps.apple.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt={t('landing.mobileApps.ios')}
              className="h-12"
            />
          </a>
          <a 
            href="https://play.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt={t('landing.mobileApps.android')}
              className="h-12"
            />
          </a>
        </div>
        <div className="mt-12 text-sm text-gray-600">
          <p>{t('landing.footer.description')}</p>
          <p className="mt-2">
            {t('landing.footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="mt-2">
            Owned by SPLabs, Ally Subsidiary by{' '}
            <a 
              href="https://www.shlenpower.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-qforma-blue hover:underline"
            >
              www.Shlenpower.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default MobileApps;
