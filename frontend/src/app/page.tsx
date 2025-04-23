import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />
      
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
          <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl transform hover:rotate-0 hover:scale-[1.01] transition-all duration-300" style={{ perspective: '1000px', transform: 'rotateX(2deg)' }}>
            {/* Browser UI */}
            <div className="h-9 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mx-auto max-w-md w-full h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center px-3 text-xs text-gray-500 dark:text-gray-400">
                app.sorttea.com/dashboard
              </div>
            </div>
            
            {/* Dashboard mockup */}
            <div className="relative w-full aspect-video bg-white dark:bg-gray-800">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-600 dark:bg-blue-500"></div>
                  <div className="w-28 h-5 bg-blue-600 dark:bg-blue-500 rounded-md"></div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-sm bg-blue-600 dark:bg-blue-400"></div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    <div className="w-5 h-5 rounded-sm bg-gray-400 dark:bg-gray-500 translate-y-1"></div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="absolute top-12 left-0 bottom-0 w-48 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 px-3 py-4">
                <div className="space-y-3">
                  <div className="w-full h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md flex items-center px-2">
                    <div className="w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></div>
                    <div className="w-20 h-4 bg-blue-600 dark:bg-blue-400 rounded-sm"></div>
                  </div>
                  <div className="w-full h-8 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center px-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400 dark:bg-gray-600 mr-2"></div>
                    <div className="w-24 h-4 bg-gray-400 dark:bg-gray-600 rounded-sm"></div>
                  </div>
                  <div className="w-full h-8 bg-gray-200 dark:bg-gray-800 rounded-md flex items-center px-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400 dark:bg-gray-600 mr-2"></div>
                    <div className="w-16 h-4 bg-gray-400 dark:bg-gray-600 rounded-sm"></div>
                  </div>
                </div>
              </div>
              
              {/* Main content */}
              <div className="absolute top-12 left-48 right-0 bottom-0 bg-gray-100 dark:bg-gray-800 p-4 overflow-hidden">
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="w-16 h-3 bg-gray-300 dark:bg-gray-700 rounded-sm"></div>
                          <div className="w-12 h-5 bg-gray-800 dark:bg-gray-100 rounded-sm"></div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-sm bg-blue-600 dark:bg-blue-400"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4 shadow-sm">
                  <div className="mb-2 w-24 h-4 bg-gray-800 dark:bg-gray-100 rounded-sm"></div>
                  <div className="h-32 w-full flex items-end justify-between px-4 pt-6 border-b border-l border-gray-200 dark:border-gray-700">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-6 bg-blue-500 dark:bg-blue-400 rounded-t-sm" style={{ height: `${20 + Math.random() * 70}%` }}></div>
                    ))}
                  </div>
                </div>
                
                {/* Table */}
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-48 h-4 bg-gray-800 dark:bg-gray-100 rounded-sm"></div>
                  </div>
                  <div className="p-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="space-y-1 flex-1">
                          <div className="w-32 h-3 bg-gray-800 dark:bg-gray-100 rounded-sm"></div>
                          <div className="w-48 h-2 bg-gray-300 dark:bg-gray-700 rounded-sm"></div>
                        </div>
                        <div className="w-16 h-6 rounded-full bg-green-100 dark:bg-green-900/30">
                          <div className="w-10 h-2 mx-auto mt-2 bg-green-500 dark:bg-green-400 rounded-sm"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                Pricing 💰
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Choose the plan that works best for your needs.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-3xl mx-auto">
            {[
              {
                title: "Free 🆓",
                price: "$0",
                description: "Perfect for beginners and casual users.",
                features: [
                  "1 giveaway per month 🎁",
                  "Up to 50 participants 👥",
                  "Pay $2 for unlimited participants 💯",
                  "Pay $2 for additional giveaways ➕",
                  "Basic analytics 📊",
                  "Includes ads 📱"
                ]
              },
              {
                title: "Premium ⭐",
                price: "$10",
                description: "For businesses and influencers who run regular giveaways.",
                features: [
                  "Unlimited giveaways 🎁 🎁 🎁",
                  "Unlimited participants 👥 👥 👥",
                  "Advanced analytics 📈",
                  "Priority support 🛎️",
                  "No ads ✨",
                  "Custom rules ⚙️"
                ],
                highlighted: true
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
                    {plan.price !== "$0" && <span className="text-gray-500 dark:text-gray-400">/month</span>}
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
                      {plan.price === "$0" ? "Get Started Free 🚀" : "Subscribe Now ✨"}
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
      
      <MarketingFooter />
    </div>
  );
}
