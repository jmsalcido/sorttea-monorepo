import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/sorttea-logo.svg" 
            alt="SortTea Logo" 
            width={40} 
            height={40}
            priority
          />
          <span className="font-bold text-xl">SortTea</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/auth/signin">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Link href="/auth/signin">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Simplify Your Instagram Giveaways with SortTea
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Create, manage, and verify Instagram giveaway entries with ease. Ensure fair winner selection and boost engagement.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signin">
              <Button size="lg" className="w-full sm:w-auto shadow-sm">Get Started for Free</Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-gray-300 dark:border-gray-700 shadow-sm">Learn More</Button>
            </Link>
          </div>
          <div className="w-full max-w-4xl aspect-video overflow-hidden rounded-xl border bg-white dark:bg-gray-800 shadow-lg">
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm text-blue-600 dark:text-blue-300">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything You Need for Successful Giveaways
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                SortTea provides all the tools you need to run successful Instagram giveaways from start to finish.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {[
              {
                title: "Easy Setup",
                description: "Create a new giveaway in minutes with our intuitive interface.",
                icon: "🚀"
              },
              {
                title: "Verification Rules",
                description: "Set custom rules for follows, likes, comments, and tags.",
                icon: "✅"
              },
              {
                title: "Automated Verification",
                description: "Automatically verify entries based on your rules.",
                icon: "⚙️"
              },
              {
                title: "Fair Winner Selection",
                description: "Randomly select winners from verified entries.",
                icon: "🏆"
              },
              {
                title: "Detailed Analytics",
                description: "Track performance with comprehensive analytics.",
                icon: "📊"
              },
              {
                title: "Export Reports",
                description: "Download detailed reports for your marketing team.",
                icon: "📋"
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-white dark:bg-gray-900 shadow-sm">
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm text-blue-600 dark:text-blue-300">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Get Started in Just 4 Simple Steps
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                SortTea streamlines the giveaway process from start to finish.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up and set up your profile in minutes."
              },
              {
                step: "2",
                title: "Connect Instagram",
                description: "Link your Instagram account with a single click."
              },
              {
                step: "3",
                title: "Create Giveaway",
                description: "Set rules, timeline, and entry requirements."
              },
              {
                step: "4",
                title: "Verify & Select",
                description: "Automatically verify entries and randomly select winners."
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 shadow-sm">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm text-blue-600 dark:text-blue-300">
                Pricing
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Choose the plan that works best for your needs.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: "Starter",
                price: "$29",
                description: "Perfect for individuals and small businesses.",
                features: [
                  "5 giveaways per month",
                  "1,000 entry verifications",
                  "Basic analytics",
                  "Email support"
                ]
              },
              {
                title: "Professional",
                price: "$79",
                description: "Ideal for growing businesses and influencers.",
                features: [
                  "Up to 20 giveaways per month",
                  "10,000 entry verifications",
                  "Advanced analytics",
                  "Priority support",
                  "Custom rules"
                ],
                highlighted: true
              },
              {
                title: "Enterprise",
                price: "Custom",
                description: "For large businesses with custom needs.",
                features: [
                  "Unlimited giveaways",
                  "Unlimited verifications",
                  "Custom integrations",
                  "Dedicated account manager",
                  "API access"
                ]
              }
            ].map((plan, i) => (
              <div 
                key={i} 
                className={`flex flex-col rounded-lg border p-6 ${
                  plan.highlighted 
                    ? "border-blue-600 dark:border-blue-400 shadow-lg bg-white dark:bg-gray-900" 
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                }`}
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{plan.title}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-500 dark:text-gray-400">/month</span>}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{plan.description}</p>
                </div>
                <ul className="mt-6 space-y-2 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/auth/signin">
                    <Button 
                      className="w-full shadow-sm" 
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 dark:bg-blue-800 text-white">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Simplify Your Giveaways?
            </h2>
            <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-90">
              Join thousands of businesses and influencers who trust SortTea for their giveaways.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signin">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-800 dark:hover:bg-white border border-transparent shadow-sm">
                Get Started for Free
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto bg-blue-500/20 backdrop-blur-sm border-white/70 text-white hover:bg-blue-500/30 hover:border-white dark:border-white/80 dark:text-white dark:hover:bg-blue-700/40 shadow-sm transition-all"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-6 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image 
                  src="/sorttea-logo.svg" 
                  alt="SortTea Logo" 
                  width={30} 
                  height={30}
                />
                <span className="font-bold">SortTea</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Simplify your Instagram giveaways with SortTea.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Testimonials</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">About</Link></li>
                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy-policy" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookie-policy" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2025 SortTea. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
