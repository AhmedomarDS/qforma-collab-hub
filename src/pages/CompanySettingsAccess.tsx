
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import AccessManagement from '@/components/company/AccessManagement';

const CompanySettingsAccess = () => {
  return (
    <AppLayout>
      <div className="animate-fadeIn">
        <AccessManagement />
      </div>
    </AppLayout>
  );
};

export default CompanySettingsAccess;
