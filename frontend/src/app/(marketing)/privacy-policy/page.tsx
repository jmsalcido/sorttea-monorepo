import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SortTea",
  description: "Privacy Policy for SortTea - Instagram Giveaway Management Platform",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg mb-6">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to SortTea ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data.
          This privacy policy explains how we collect, use, process, and share your information when you use our services.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        <p>We collect several types of information from and about users of our platform:</p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li><strong>Account Information:</strong> When you register, we collect your name, email address, and password.</li>
          <li><strong>Profile Information:</strong> User profile details such as profile pictures and Instagram username.</li>
          <li><strong>Social Media Data:</strong> When you connect your Instagram account, we access data as described in the Instagram API permissions you grant.</li>
          <li><strong>Giveaway Data:</strong> Information about giveaways you create and manage, including participant data.</li>
          <li><strong>Usage Data:</strong> Information about how you use our platform, including analytics.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p>We use your information for various purposes, including:</p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>Providing, maintaining, and improving our services</li>
          <li>Processing and managing your giveaways</li>
          <li>Communicating with you about our services</li>
          <li>Analyzing usage patterns to enhance user experience</li>
          <li>Complying with legal obligations</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. How We Share Your Information</h2>
        <p>We may share your information with:</p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf</li>
          <li><strong>Business Partners:</strong> Companies we partner with to offer integrated services</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
        <p>Depending on your location, you may have certain rights regarding your personal data:</p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>Access to your personal data</li>
          <li>Correction of inaccurate data</li>
          <li>Deletion of your data</li>
          <li>Restriction of processing</li>
          <li>Data portability</li>
          <li>Objection to processing</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Instagram Data</h2>
        <p>
          Our platform integrates with Instagram. When you connect your Instagram account, we access and store data in accordance
          with Instagram's Platform Policy. We only request necessary permissions to provide our services.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. However, no method of transmission
          over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
        <p>
          Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from
          children under 13.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to Our Privacy Policy</h2>
        <p>
          We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy
          on this page and updating the "Last updated" date.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our practices, please contact us at:
          <br />
          <a href="mailto:privacy@sorttea.com" className="text-primary hover:underline">privacy@sorttea.com</a>
        </p>
      </div>
    </div>
  );
} 