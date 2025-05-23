
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CheckCircle, ShieldCheck, Zap, Package, Cpu, Smartphone, GitBranch } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  const { t } = useTranslation();
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [email, setEmail] = useState("");
  
  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric characters and hyphens
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(value);
  };
  
  const handleRegister = (plan: string) => {
    if (!companyName || !subdomain || !email) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to continue",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, this would contact Supabase to create the company account
    console.log(`Registering company: ${companyName}, subdomain: ${subdomain}, plan: ${plan}`);
    toast({
      title: "Registration Started",
      description: `We're setting up your ${plan} account at ${subdomain}.qforma.app`,
    });
    
    // Navigate to registration or onboarding
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Language switcher in header */}
      <header className="fixed top-0 right-0 z-10 p-4">
        <LanguageSwitcher />
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl h-16 w-16 flex items-center justify-center font-bold text-4xl mr-4">
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
                  <div className="flex items-center">
                    <Input 
                      type="text" 
                      placeholder={t('landing.domain.subdomainPlaceholder')}
                      value={subdomain}
                      onChange={handleSubdomainChange}
                      className="rounded-r-none"
                    />
                    <span className="bg-muted px-3 py-2 border border-l-0 border-input rounded-r-md text-muted-foreground">
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
                    onClick={() => handleRegister('Pro')} 
                    className="w-full bg-qforma-blue hover:bg-qforma-blue/90"
                  >
                    {t('landing.domain.buttonText')}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    {t('landing.domain.noCreditCard')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-qforma-teal to-qforma-blue opacity-30 blur"></div>
                <div className="relative bg-card rounded-lg border shadow-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop" 
                    alt="QForma Dashboard - Software Development Management Platform" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold mb-1">Complete SDLC Management</h3>
                    <p className="text-sm opacity-90">Streamline your development process</p>
                  </div>
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
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Need a custom solution? <Button variant="link" className="p-0 h-auto">Contact our sales team</Button>
            </p>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">{t('landing.features.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border">
              <div className="bg-qforma-teal/10 p-2 rounded-lg inline-block mb-4">
                <svg className="h-6 w-6 text-qforma-teal" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 12a2 2 0 002 2h2a2 2 0 002-2M9 12a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Requirement Management</h3>
              <p className="text-muted-foreground">Capture, organize, and track requirements with full traceability to test cases.</p>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/login')}
            >
              {t('landing.cta.signIn')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-qforma-blue"
            >
              {t('landing.cta.requestDemo')}
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="bg-qforma-teal text-white rounded-lg h-8 w-8 flex items-center justify-center font-bold text-xl">Q</div>
                <span className="text-xl font-bold ml-2 text-qforma-blue">QForma</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Enterprise-grade QA management platform for modern testing teams
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-medium mb-3">Product</h3>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">Features</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Pricing</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Integrations</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Changelog</Button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">Documentation</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Blog</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Community</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Support</Button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Company</h3>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">About</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Careers</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Contact</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Partners</Button></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><Button variant="link" className="p-0 h-auto">Privacy</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Terms</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Security</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Cookies</Button></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-muted">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} QForma Technologies, Inc. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
