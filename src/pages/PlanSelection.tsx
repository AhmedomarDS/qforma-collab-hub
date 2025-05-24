
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CheckCircle, ShieldCheck, Zap, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const PlanSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const pricingPlans = [
    {
      name: "Free",
      description: "Basic features, 1 user",
      price: "$0",
      period: "month",
      features: ["1 user account", "Basic QA tracking", "Limited requirements", "Manual test cases"],
      buttonText: "Start Free Trial",
      highlighted: false,
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      name: "Pro",
      description: "All QA modules, 10 projects",
      price: "$9",
      period: "user/month",
      features: ["Up to 10 users", "Unlimited projects", "Full test management", "Defect tracking", "Basic reporting"],
      buttonText: "Start Pro Trial",
      highlighted: true,
      icon: <Zap className="h-5 w-5" />
    },
    {
      name: "Premium",
      description: "AI + Traceability Matrix",
      price: "$25",
      period: "user/month",
      features: ["Unlimited users", "AI test generation", "Traceability matrix", "Advanced analytics", "Priority support"],
      buttonText: "Start Premium Trial",
      highlighted: false,
      icon: <ShieldCheck className="h-5 w-5" />
    },
    {
      name: "Enterprise",
      description: "On-prem, SSO, integrations",
      price: "Custom",
      period: "$25K+/year",
      features: ["On-premises deployment", "Single sign-on", "Custom integrations", "Dedicated support", "SLA guarantees"],
      buttonText: "Start Enterprise Trial",
      highlighted: false,
      icon: <Package className="h-5 w-5" />
    }
  ];

  const handlePlanSelection = (plan: string) => {
    const registrationData = localStorage.getItem('registration-data');
    if (!registrationData) {
      toast({
        title: "Error",
        description: "Registration data not found. Please start the registration process again.",
        variant: "destructive"
      });
      navigate("/landing");
      return;
    }

    const { subdomain } = JSON.parse(registrationData);
    
    // Store selected plan
    localStorage.setItem('selected-plan', plan);
    
    // Set trial period (1 week from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    localStorage.setItem('trial-end-date', trialEndDate.toISOString());
    
    toast({
      title: "Plan Selected",
      description: `Starting your 7-day ${plan} trial at ${subdomain}.qforma.app`,
    });
    
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto max-w-6xl py-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Start with a 7-day free trial of all features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name}
              className={`flex flex-col ${
                plan.highlighted 
                  ? 'border-qforma-blue shadow-lg shadow-qforma-blue/10 relative overflow-hidden' 
                  : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0">
                  <div className="bg-qforma-teal text-white px-3 py-1 text-xs font-medium transform rotate-45 translate-x-7 translate-y-3 shadow-sm">
                    Popular
                  </div>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-full ${plan.highlighted ? 'bg-qforma-blue/10 text-qforma-blue' : 'bg-muted'}`}>
                    {plan.icon}
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-qforma-teal" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handlePlanSelection(plan.name)} 
                  className={`w-full ${
                    plan.highlighted 
                      ? 'bg-qforma-blue hover:bg-qforma-blue/90' 
                      : plan.name === 'Enterprise' 
                        ? 'bg-muted-foreground hover:bg-muted-foreground/90 text-white'
                        : ''
                  }`}
                  variant={!plan.highlighted && plan.name !== 'Enterprise' ? "outline" : "default"}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            All plans include a 7-day free trial with full access to features
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;
