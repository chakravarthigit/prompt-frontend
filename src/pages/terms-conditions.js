import React from 'react';
import Layout from '../Layout';

const TermsConditions = () => {
  return (
    <Layout currentPageName="Terms & Conditions">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-sm border border-purple-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
          
          <div className="prose prose-indigo max-w-none">
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
            <p>Welcome to PromptWizard. These Terms and Conditions govern your use of our website and services.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Acceptance of Terms</h2>
            <p>By accessing or using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our website.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Use of Services</h2>
            <p>PromptWizard provides tools for optimizing AI prompts. Users are responsible for the content they create and share using our services.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. User Accounts</h2>
            <p>To access certain features of our website, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account information.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Intellectual Property</h2>
            <p>The content, features, and functionality of our website are owned by PromptWizard and are protected by international copyright, trademark, and other intellectual property laws.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Limitation of Liability</h2>
            <p>PromptWizard shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, our services.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will provide notice of any material changes by updating the "Last Updated" date.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Contact Us</h2>
            <p>If you have any questions about these Terms and Conditions, please contact us through the links provided in the footer of our website.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsConditions; 