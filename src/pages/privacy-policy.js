import React from 'react';
import Layout from '../Layout';

export default function PrivacyPolicy() {
  return (
    <Layout currentPageName="Privacy Policy">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-indigo-600">Cookie Policy</h2>
            <p className="mb-3">
              PromptWizard uses cookies to enhance your experience on our website. This policy explains how we use these cookies.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-indigo-600">What are cookies?</h2>
            <p className="mb-3">
              Cookies are small text files that are stored on your device when you visit a website. They help us recognize your device and remember information about your visit.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-indigo-600">How we use cookies</h2>
            <p className="mb-3">PromptWizard uses cookies for the following purposes:</p>
            <ul className="list-disc ml-6 mb-3">
              <li className="mb-2"><strong>Authentication:</strong> We use cookies to identify you when you visit our website and to help you navigate between pages.</li>
              <li className="mb-2"><strong>Security:</strong> We use cookies as a security measure to protect user accounts and prevent unauthorized access.</li>
              <li className="mb-2"><strong>User Preferences:</strong> We use cookies to remember your preferences and settings.</li>
              <li className="mb-2"><strong>Analytics:</strong> We use cookies to understand how visitors use our website and to improve our services.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-indigo-600">Types of cookies we use</h2>
            <ul className="list-disc ml-6 mb-3">
              <li className="mb-2"><strong>Essential cookies:</strong> These cookies are necessary for the website to function and cannot be turned off in our systems.</li>
              <li className="mb-2"><strong>Authentication cookies:</strong> These cookies help us identify you when you're logged in so you can access your account securely.</li>
              <li className="mb-2"><strong>Preference cookies:</strong> These cookies enable the website to remember choices you make (such as your preferred language).</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-indigo-600">Managing cookies</h2>
            <p className="mb-3">
              Most web browsers allow you to control cookies through their settings. You can typically find these settings in the "options" or "preferences" menu of your browser.
            </p>
            <p>
              However, please note that disabling cookies may affect the functionality of our website and your user experience.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-indigo-600">Changes to this policy</h2>
            <p className="mb-3">
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-indigo-600">Contact us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us at support@promptwizard.com.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
} 