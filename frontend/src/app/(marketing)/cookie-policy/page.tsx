import { Metadata } from "next";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Cookie Policy | Sorttea",
  description: "Learn about how Sorttea uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            This Cookie Policy explains how Sorttea uses cookies and similar technologies to recognize you when you visit our website. 
            It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. What Are Cookies?</h2>
          <p className="mb-4">
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
            Cookies are widely used by website owners to make their websites work, or to work more efficiently, 
            as well as to provide reporting information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Why Do We Use Cookies?</h2>
          <p className="mb-4">
            We use cookies for several reasons:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>To provide essential website functionality</li>
            <li>To improve website performance</li>
            <li>To remember your preferences</li>
            <li>To understand how visitors use our website</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Types of Cookies We Use</h2>
          <p className="mb-4">
            We use the following types of cookies:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Essential cookies (required for website operation)</li>
            <li>Performance cookies (help us understand how visitors use our website)</li>
            <li>Functionality cookies (remember your preferences)</li>
            <li>Analytics cookies (help us improve our website)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
          <p className="mb-4">
            You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer 
            and you can set most browsers to prevent them from being placed. If you do this, however, you may have to 
            manually adjust some preferences every time you visit a site and some services and functionalities may not work.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our use of cookies, please contact us at:
            <br />
            <a href="mailto:privacy@sorttea.com" className="text-blue-600 hover:underline">
              privacy@sorttea.com
            </a>
          </p>
        </section>

        <section>
          <p className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>
      </div>

      <MarketingFooter />
    </div>
  );
} 