import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ContactForm } from "@/components/ui/contact-form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CheckCircle, ShieldCheck, Zap, Package, Cpu, Smartphone, GitBranch, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import WorkflowDiagram from "@/components/ui/WorkflowDiagram";

// Pricing plan data
const pricingPlans = [
  {
    name: "Free",
    description: "Basic features, 1 user",
    price: "$0",
    period: "month",
    features: ["1 user account", "Basic QA tracking", "Limited requirements", "Manual test cases"],
    buttonText: "Get Started",
    highlighted: false,
    icon: <CheckCircle className="h-5 w-5" />
  },
  {
    name: "Pro",
    description: "All QA modules, 10 projects",
    price: "$9",
    period: "user/month",
    features: ["Up to 10 users", "Unlimited projects", "Full test management", "Defect tracking", "Basic reporting"],
    buttonText: "Subscribe Now",
    highlighted: true,
    icon: <Zap className="h-5 w-5" />
  },
  {
    name: "Premium",
    description: "AI + Traceability Matrix",
    price: "$25",
    period: "user/month",
    features: ["Unlimited users", "AI test generation", "Traceability matrix", "Advanced analytics", "Priority support"],
    buttonText: "Go Premium",
    highlighted: false,
    icon: <ShieldCheck className="h-5 w-5" />
  },
  {
    name: "Enterprise",
    description: "On-prem, SSO, integrations",
    price: "Custom",
    period: "$25K+/year",
    features: ["On-premises deployment", "Single sign-on", "Custom integrations", "Dedicated support", "SLA guarantees"],
    buttonText: "Contact Sales",
    highlighted: false,
    icon: <Package className="h-5 w-5" />
  }
];

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [email, setEmail] = useState("");
  
  const isRTL = i18n.language === 'ar';
  
  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric characters and hyphens
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(value);
  };
  
  const handleInitialRegistration = () => {
    if (!companyName || !subdomain || !email) {
      toast({
        title: t('common.error') || "Missing information",
        description: t('landing.domain.missingFields') || "Please fill in all fields to continue",
        variant: "destructive"
      });
      return;
    }
    
    console.log(`Creating subdomain: ${subdomain}.qforma.app for company: ${companyName}`);
    
    // Store registration data for later use
    localStorage.setItem('registration-data', JSON.stringify({
      companyName,
      subdomain,
      email,
      registrationDate: new Date().toISOString()
    }));
    
    toast({
      title: t('landing.domain.subdomainCreated') || "Subdomain Created",
      description: t('landing.domain.subdomainSuccess', { subdomain }) || `Your subdomain ${subdomain}.qforma.app has been created successfully!`,
    });
    
    // Redirect directly to signup page
    navigate("/auth?tab=signup");
  };
  
  const handleRegister = (plan: string) => {
    const registrationData = localStorage.getItem('registration-data');
    if (!registrationData) {
      toast({
        title: t('common.error') || "Error",
        description: "Registration data not found. Please start the registration process again.",
        variant: "destructive"
      });
      navigate("/landing");
      return;
    }
    
    const { subdomain } = JSON.parse(registrationData);
    
    console.log(`Registering with plan: ${plan} for subdomain: ${subdomain}`);
    
    // Store selected plan
    localStorage.setItem('selected-plan', plan);
    
    // Set trial period (1 week from now)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    localStorage.setItem('trial-end-date', trialEndDate.toISOString());
    
    toast({
      title: t('landing.domain.registrationStarted') || "Registration Started",
      description: t('landing.domain.settingUp', { plan, subdomain }) || `Starting your ${plan} trial at ${subdomain}.qforma.app`,
    });
    
    navigate("/auth?tab=signup");
  };
  
  return (
    <div className={`min-h-screen bg-gradient-to-b from-background to-muted ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-card/95 backdrop-blur-sm border-b flex items-center justify-between px-4">
        <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl h-10 w-10 flex items-center justify-center font-bold text-2xl">
            Q
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">{t('app.title')}</span>
            <p className="text-xs text-muted-foreground">{t('app.subtitle')}</p>
          </div>
        </div>
        
        <LanguageSwitcher />
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 mt-14">
        <div className="container mx-auto max-w-6xl">
          <div className={`flex flex-col md:flex-row items-center gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <div className={`flex items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl h-16 w-16 flex items-center justify-center font-bold text-4xl ${isRTL ? 'ml-4' : 'mr-4'}`}>
                  Q
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-qforma-blue mb-2">
                    {t('landing.hero.title')}
                  </h1>
                  <p className="text-xl text-qforma-teal font-semibold">
                    {t('landing.hero.subtitle')}
                  </p>
                </div>
              </div>
              <p className="text-lg mb-8 text-muted-foreground">
                {t('landing.hero.description')}
              </p>
              
              {/* Mobile App Download Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">{t('landing.mobileApps.title')}</h3>
                <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button variant="outline" className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black">
                    <img 
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                      alt="Download on App Store" 
                      className="h-8"
                    />
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 border-black">
                    <img 
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                      alt="Get it on Google Play" 
                      className="h-8"
                    />
                  </Button>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-muted shadow-lg">
                <h2 className="text-xl font-semibold mb-4">{t('landing.domain.title')}</h2>
                <div className="space-y-4">
                  <div>
                    <Input 
                      type="text" 
                      placeholder={t('landing.domain.companyPlaceholder')}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="mb-2"
                    />
                  </div>
                  <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Input 
                      type="text" 
                      placeholder={t('landing.domain.subdomainPlaceholder')}
                      value={subdomain}
                      onChange={handleSubdomainChange}
                      className={isRTL ? "rounded-l-none" : "rounded-r-none"}
                    />
                    <span className={`bg-muted px-3 py-2 border border-input text-muted-foreground ${isRTL ? 'border-r-0 rounded-l-md' : 'border-l-0 rounded-r-md'}`}>
                      .qforma.app
                    </span>
                  </div>
                  <div>
                    <Input 
                      type="email" 
                      placeholder={t('landing.domain.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleInitialRegistration} 
                    className="w-full bg-qforma-blue hover:bg-qforma-blue/90"
                  >
                    Create your Company Space
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    {t('landing.domain.freeTrialInfo') || "Start with a 7-day free trial of all features"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-qforma-teal to-qforma-blue opacity-30 blur"></div>
                <div className="relative bg-card rounded-lg border shadow-xl overflow-hidden p-4">
                  <WorkflowDiagram />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/50" id="pricing">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-3">{t('landing.pricing.title')}</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
            {t('landing.pricing.description')}
          </p>
          
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
                  <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'}`}>
                    <div className={`bg-qforma-teal text-white px-3 py-1 text-xs font-medium transform shadow-sm ${isRTL ? 'rotate-[-45deg] -translate-x-7 translate-y-3' : 'rotate-45 translate-x-7 translate-y-3'}`}>
                      {t('landing.pricing.popular')}
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`p-1.5 rounded-full ${plan.highlighted ? 'bg-qforma-blue/10 text-qforma-blue' : 'bg-muted'}`}>
                      {plan.icon}
                    </div>
                    <CardTitle>{t(`landing.pricing.plans.${plan.name.toLowerCase()}.name`) || plan.name}</CardTitle>
                  </div>
                  <CardDescription>{t(`landing.pricing.plans.${plan.name.toLowerCase()}.description`) || plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{t(`landing.pricing.plans.${plan.name.toLowerCase()}.period`) || plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <CheckCircle className="h-4 w-4 text-qforma-teal" />
                        <span>{t(`landing.pricing.plans.${plan.name.toLowerCase()}.features.${index}`) || feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleRegister(plan.name)} 
                    className={`w-full ${
                      plan.highlighted 
                        ? 'bg-qforma-blue hover:bg-qforma-blue/90' 
                        : plan.name === 'Enterprise' 
                          ? 'bg-muted-foreground hover:bg-muted-foreground/90 text-white'
                          : ''
                    }`}
                    variant={!plan.highlighted && plan.name !== 'Enterprise' ? "outline" : "default"}
                  >
                    {t(`landing.pricing.plans.${plan.name.toLowerCase()}.buttonText`) || plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              {t('landing.pricing.customSolution')} <Button variant="link" className="p-0 h-auto">{t('landing.pricing.contactSales')}</Button>
            </p>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">{t('landing.features.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards with proper RTL support */}
            <div className="bg-card p-6 rounded-lg border">
              <div className={`bg-qforma-teal/10 p-2 rounded-lg inline-block mb-4 ${isRTL ? 'float-right' : 'float-left'}`}>
                <svg className="h-6 w-6 text-qforma-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 12a2 2 0 002 2h2a2 2 0 002-2M9 12a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="clear-both">
                <h3 className="text-xl font-semibold mb-2">{t('landing.features.requirements.title')}</h3>
                <p className="text-muted-foreground">{t('landing.features.requirements.description')}</p>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-qforma-blue/10 p-2 rounded-lg inline-block mb-4">
                <svg className="h-6 w-6 text-qforma-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Test Case Management</h3>
              <p className="text-muted-foreground">Create, execute, and track test cases with detailed reporting and history.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-qforma-danger/10 p-2 rounded-lg inline-block mb-4">
                <svg className="h-6 w-6 text-qforma-danger" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Defect Tracking</h3>
              <p className="text-muted-foreground">Report, assign, and resolve defects with comprehensive lifecycle management.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-purple-500/10 p-2 rounded-lg inline-block mb-4">
                <svg className="h-6 w-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Assistance</h3>
              <p className="text-muted-foreground">Generate test cases and requirements automatically with our advanced AI tools.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-amber-500/10 p-2 rounded-lg inline-block mb-4">
                <svg className="h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Performance Testing</h3>
              <p className="text-muted-foreground">Record and execute performance test scenarios with detailed analytics.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-green-500/10 p-2 rounded-lg inline-block mb-4">
                <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Design Management</h3>
              <p className="text-muted-foreground">Create and manage high-level and low-level design documents with approval workflows.</p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-indigo-500/10 p-2 rounded-lg inline-block mb-4">
                <Cpu className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browser Compatibility Testing</h3>
              <p className="text-muted-foreground">Test your applications across different browsers and versions to ensure consistent user experience.</p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-pink-500/10 p-2 rounded-lg inline-block mb-4">
                <Smartphone className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mobile Compatibility Testing</h3>
              <p className="text-muted-foreground">Ensure your mobile applications work flawlessly across different devices and operating systems.</p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-cyan-500/10 p-2 rounded-lg inline-block mb-4">
                <GitBranch className="h-6 w-6 text-cyan-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Platform Integration</h3>
              <p className="text-muted-foreground">Seamlessly integrate with AI platforms for automated test generation and intelligent analysis.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 px-4 bg-qforma-blue text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">{t('landing.cta.title')}</h2>
          <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
            {t('landing.cta.description')}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/auth')}
            >
              {t('landing.cta.signIn')}
            </Button>
            <ContactForm>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-qforma-blue"
              >
                {t('landing.cta.requestDemo')}
              </Button>
            </ContactForm>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className={`flex flex-col md:flex-row justify-between ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <div className="mb-8 md:mb-0">
              <div className={`flex items-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="bg-qforma-teal text-white rounded-lg h-8 w-8 flex items-center justify-center font-bold text-xl">Q</div>
                <span className={`text-xl font-bold text-qforma-blue ${isRTL ? 'mr-2' : 'ml-2'}`}>QForma</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                {t('landing.footer.description')}
              </p>
              
              {/* Mobile App Download Links in Footer */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">{t('landing.mobileApps.title')}</h4>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Button variant="outline" size="sm" className="p-1 h-10 bg-black text-white hover:bg-gray-800 border-black">
                    <img 
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                      alt="Download on App Store" 
                      className="h-6"
                    />
                  </Button>
                  <Button variant="outline" size="sm" className="p-1 h-10 bg-black text-white hover:bg-gray-800 border-black">
                    <img 
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                      alt="Get it on Google Play" 
                      className="h-6"
                    />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${isRTL ? 'text-right' : ''}`}>
              <div>
                <h3 className="font-medium mb-3">{t('landing.footer.product.title')}</h3>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.product.features')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.product.pricing')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.product.integrations')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.product.changelog')}</Button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">{t('landing.footer.resources.title')}</h3>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.resources.documentation')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.resources.blog')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.resources.community')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.resources.support')}</Button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">{t('landing.footer.company.title')}</h3>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.company.about')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.company.careers')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.company.contact')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.company.partners')}</Button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">{t('landing.footer.legal.title')}</h3>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.legal.privacy')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.legal.terms')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.legal.security')}</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">{t('landing.footer.legal.cookies')}</Button></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-muted">
            <div className={`flex flex-col md:flex-row justify-between items-center ${isRTL ? 'md:flex-row-reverse' : ''}`}>
              <div className="text-center md:text-left">
                <p className="text-muted-foreground text-sm">
                  {t('landing.footer.copyright', { year: new Date().getFullYear() })}
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Owned by SPLabs, Ally Subsidiary by{' '}
                  <a 
                    href="https://www.shlenpower.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-qforma-blue hover:text-qforma-blue/80 underline"
                  >
                    www.Shlenpower.com
                  </a>
                </p>
              </div>
              <div className={`flex space-x-4 mt-4 md:mt-0 ${isRTL ? 'space-x-reverse' : ''}`}>
                {/* Social media icons remain the same */}
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Button>
                {/* ... keep existing code (other social media icons) ... */}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
