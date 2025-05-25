
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ContactFormProps {
  children: React.ReactNode;
}

export const ContactForm: React.FC<ContactFormProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleContactSales = () => {
    navigate('/contact-sales');
  };

  return (
    <div onClick={handleContactSales}>
      {children}
    </div>
  );
};
