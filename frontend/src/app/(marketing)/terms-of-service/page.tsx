import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SortTea",
  description: "Terms of Service for SortTea - Instagram Giveaway Management Platform",
};

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg mb-6">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to SortTea ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of the SortTea 
          platform, including our website, services, and applications (collectively, the "Services").
        </p>
        <p>
          By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, 
          you may not access or use the Services.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Acceptance of Terms</h2>
        <p>
          By creating an account, accessing, or using our Services, you acknowledge that you have read, understood, and agree 
          to be bound by these Terms. If you are using the Services on behalf of an organization, you represent and warrant 
          that you have the authority to bind that organization to these Terms.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. If we make changes, we will provide notice through our Services, such as by 
          displaying a prominent notice on our website, or by sending you an email. Your continued use of our Services after 
          any such changes constitutes your acceptance of the new Terms.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Account Registration and Security</h2>
        <p>
          To use certain features of our Services, you may need to create an account. You agree to provide accurate, 
          current, and complete information during the registration process and to update such information to keep it 
          accurate, current, and complete.
        </p>
        <p>
          You are responsible for safeguarding your password and for all activities that occur under your account. 
          You agree to notify us immediately if you suspect any unauthorized use of your account or access to your password.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Use of Services</h2>
        <p>
          Our Services are designed to help you create, manage, and verify Instagram giveaways. You may use our Services only 
          as permitted by these Terms and in compliance with all applicable laws, regulations, and Instagram's Platform Policy.
        </p>
        <p>
          You agree not to:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>Use our Services for any illegal purpose or in violation of any laws</li>
          <li>Violate Instagram's Terms of Service or Platform Policy</li>
          <li>Infringe or violate the intellectual property or privacy rights of others</li>
          <li>Interfere with or disrupt the operation of our Services</li>
          <li>Attempt to gain unauthorized access to our Services or systems</li>
          <li>Use our Services to spam, harass, or mislead others</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Subscription and Payment</h2>
        <p>
          Certain features of our Services may require a subscription. By subscribing to a paid plan, you agree to pay the 
          subscription fees as described at the time of purchase. Subscription fees are non-refundable except as required by law 
          or as explicitly stated in these Terms.
        </p>
        <p>
          We may change our subscription fees at any time, but changes will not apply retroactively. We will provide notice 
          of any fee changes before they become effective.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Third-Party Services</h2>
        <p>
          Our Services may integrate with third-party services, such as Instagram. Your use of such third-party services is 
          subject to their terms of service and privacy policies. We are not responsible for the practices of such third parties.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
        <p>
          Our Services and all content included on our platform, such as text, graphics, logos, and software, are the property 
          of SortTea or its licensors and are protected by copyright and other intellectual property laws.
        </p>
        <p>
          We grant you a limited, non-exclusive, non-transferable, and revocable license to use our Services for their 
          intended purposes, subject to these Terms.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, SortTea and its officers, directors, employees, and agents shall not be 
          liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
          loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or 
          inability to access or use the Services.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Termination</h2>
        <p>
          We may terminate or suspend your access to our Services immediately, without prior notice or liability, for any 
          reason, including, without limitation, if you breach these Terms.
        </p>
        <p>
          Upon termination, your right to use the Services will immediately cease. All provisions of these Terms which by 
          their nature should survive termination shall survive termination, including, without limitation, ownership 
          provisions, warranty disclaimers, indemnity, and limitations of liability.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which SortTea 
          is established, without regard to its conflict of law provisions.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
          <br />
          <a href="mailto:legal@sorttea.com" className="text-primary hover:underline">legal@sorttea.com</a>
        </p>
      </div>
    </div>
  );
} 