import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | SortTea",
  description: "Cookie Policy for SortTea - Instagram Giveaway Management Platform",
};

export default function CookiePolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Cookie Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-lg mb-6">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          This Cookie Policy explains how SortTea ("we," "our," or "us") uses cookies and similar technologies to recognize 
          you when you visit our website and use our services. It explains what these technologies are and why we use them, 
          as well as your rights to control our use of them.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. What Are Cookies?</h2>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies 
          are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide 
          reporting information.
        </p>
        <p>
          Cookies set by the website owner (in this case, SortTea) are called "first-party cookies." Cookies set by parties 
          other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or 
          functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h2>
        <p>
          We use the following types of cookies:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>
            <strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off 
            in our systems. They are usually set in response to actions made by you which amount to a request for services, 
            such as setting your privacy preferences, logging in, or filling in forms.
          </li>
          <li>
            <strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and 
            improve the performance of our site. They help us to know which pages are the most and least popular and see how 
            visitors move around the site.
          </li>
          <li>
            <strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and 
            personalization. They may be set by us or by third-party providers whose services we have added to our pages.
          </li>
          <li>
            <strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising partners. They may be 
            used by those companies to build a profile of your interests and show you relevant advertisements on other sites.
          </li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Specific Cookies We Use</h2>
        <table className="w-full mt-4 mb-6 border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Purpose</th>
              <th className="border p-2 text-left">Duration</th>
              <th className="border p-2 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">session_id</td>
              <td className="border p-2">Keeps you logged in during a session</td>
              <td className="border p-2">Session</td>
              <td className="border p-2">Essential</td>
            </tr>
            <tr>
              <td className="border p-2">_st_preferences</td>
              <td className="border p-2">Stores your preferences across the site</td>
              <td className="border p-2">1 year</td>
              <td className="border p-2">Functional</td>
            </tr>
            <tr>
              <td className="border p-2">_st_analytics</td>
              <td className="border p-2">Helps us understand how visitors use our site</td>
              <td className="border p-2">2 years</td>
              <td className="border p-2">Performance</td>
            </tr>
          </tbody>
        </table>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Third-Party Cookies</h2>
        <p>
          In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver 
          advertisements, and so on. These cookies may include:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>Google Analytics cookies for website analytics</li>
          <li>Social media cookies for sharing and engagement</li>
          <li>Payment processor cookies for processing transactions</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">6. How to Control Cookies</h2>
        <p>
          You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you 
          may still use our website though your access to some functionality and areas of our website may be restricted.
        </p>
        <p>
          Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, 
          including how to see what cookies have been set, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.allaboutcookies.org</a>.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use 
          or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to 
          stay informed about our use of cookies and related technologies.
        </p>
        <p>
          The date at the top of this Cookie Policy indicates when it was last updated.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
        <p>
          If you have any questions about our use of cookies or other technologies, please contact us at:
          <br />
          <a href="mailto:privacy@sorttea.com" className="text-primary hover:underline">privacy@sorttea.com</a>
        </p>
      </div>
    </div>
  );
} 