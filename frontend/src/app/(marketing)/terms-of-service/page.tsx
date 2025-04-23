import { Metadata } from "next";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Terms of Service | Sorttea",
  description: "Learn about the terms and conditions for using Sorttea.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingHeader />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to Sorttea. By accessing or using our service, you agree to be bound by these Terms of Service. 
            Please read them carefully before using our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Account Registration</h2>
          <p className="mb-4">
            To use our service, you must:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Be at least 18 years old</li>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Be responsible for all activities under your account</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Service Usage</h2>
          <p className="mb-4">
            You agree to use our service only for lawful purposes and in accordance with these Terms. You must not:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Violate any laws or regulations</li>
            <li>Infringe on others' rights</li>
            <li>Interfere with the service's operation</li>
            <li>Attempt to gain unauthorized access</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
          <p className="mb-4">
            All content and materials available on our service are protected by intellectual property rights. 
            You may not use, copy, or distribute any content without our permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p className="mb-4">
            Our service is provided "as is" without warranties of any kind. We are not liable for any damages 
            that may occur from using our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
          <p className="mb-4">
            We may modify these Terms at any time. We will notify you of any changes by posting the new Terms 
            on this page and updating the "Last updated" date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
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