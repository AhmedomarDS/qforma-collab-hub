
import React from 'react';
import { Button } from '@/components/ui/button';
import { LifeBuoy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SupportButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export const SupportButton: React.FC<SupportButtonProps> = ({ 
  variant = 'default', 
  size = 'default',
  className = '',
  children 
}) => {
  const navigate = useNavigate();

  const handleSupportClick = () => {
    navigate('/support');
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      onClick={handleSupportClick}
    >
      <LifeBuoy className="h-4 w-4 mr-2" />
      {children || 'Support Center'}
    </Button>
  );
};
