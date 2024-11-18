import Section from "@/components/layout/Section";

const PrivacyPolicy = () => {
  return (
    <div className="bg-eventoPurpleDark text-white min-h-screen py-16 w-full">
      {/* Section principale */}
      <Section className="max-w-4xl mx-auto space-y-10 px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center">PRIVACY POLICY</h1>
        <p className="text-sm text-center">Last Updated November 15, 2024</p>

        <p>
          Welcome to Evento (“we,” “our,” or “us”). We respect your privacy and
          are committed to protecting your personal information. This Privacy
          Policy outlines how we collect, store, use, and protect your personal
          data when you use any of our services (collectively, “Services”), such
          as when you:
        </p>
        <ul className="list-disc ml-5 space-y-3">
          <li>
            Visit our website at{" "}
            <a href="http://www.evento-app.io" className="underline">
              http://www.evento-app.io
            </a>
          </li>
          <li>
            Engage with us in other related ways, including any sales,
            marketing, or events.
          </li>
        </ul>
        <p>
          If you have questions or concerns, please contact us at{" "}
          <a href="mailto:evento_app@outlook.com" className="underline">
            evento_app@outlook.com
          </a>
          .
        </p>

        {/* Section 1 - Information We Collect */}
        <h2 className="text-2xl font-bold">1. Information We Collect</h2>
        <p>In short: We collect personal information that you provide to us.</p>
        <h3 className="font-semibold">A. Personal Data</h3>
        <p>We collect personal data you voluntarily provide, including:</p>
        <ul className="list-disc ml-5 space-y-3">
          <li>Name(s)</li>
          <li>Email address</li>
          <li>Date of Birth</li>
          <li>Social media links</li>
          <li>Event registration details</li>
        </ul>

        <h3 className="font-semibold">B. Usage Data</h3>
        <p>
          We automatically collect data about how you access and use our
          Services, such as IP address, device type, browser, and location data
          (if enabled).
        </p>

        {/* Section 2 - How We Use Your Data */}
        <h2 className="text-2xl font-bold">2. How We Use Your Data</h2>
        <ul className="list-disc ml-5 space-y-3">
          <li>Providing and improving our Services</li>
          <li>Account management</li>
          <li>Communication and customer support</li>
          <li>Analytics & Service Monitoring</li>
          <li>Legal compliance</li>
        </ul>

        {/* Section 3 - GDPR Compliance */}
        <h2 className="text-2xl font-bold">3. GDPR Compliance</h2>
        <p>We process your data based on:</p>
        <ul className="list-disc ml-5 space-y-3">
          <li>Consent</li>
          <li>Contractual necessity</li>
          <li>Legitimate interests</li>
          <li>Legal obligations</li>
        </ul>

        {/* Section 4 - Data Sharing */}
        <h2 className="text-2xl font-bold">4. How We Share Your Data</h2>
        <p>
          We may share your data with third-party service providers, legal
          advisors, or in the event of a business transfer.
        </p>

        {/* Section 5 - Data Retention */}
        <h2 className="text-2xl font-bold">5. Data Retention</h2>
        <p>
          We retain your data as long as necessary to fulfill the purposes
          outlined in this Privacy Policy or as required by law.
        </p>

        {/* Section 6 - Security of Your Data */}
        <h2 className="text-2xl font-bold">6. Security of Your Data</h2>
        <p>
          We use commercially acceptable means to protect your data but cannot
          guarantee 100% security. Please access the Services within a secure
          environment.
        </p>

        {/* Section 7 - Your Data Protection Rights */}
        <h2 className="text-2xl font-bold">7. Your Data Protection Rights</h2>
        <ul className="list-disc ml-5 space-y-3">
          <li>Access</li>
          <li>Rectification</li>
          <li>Deletion</li>
          <li>Restriction of processing</li>
          <li>Data portability</li>
          <li>Objection</li>
        </ul>

        {/* Section 8 - Third-Party Websites */}
        <h2 className="text-2xl font-bold">8. Third-Party Websites</h2>
        <p>
          Our Site may contain links to third-party websites or services that
          are not operated by us. We encourage you to review their privacy
          policies.
        </p>

        {/* Section 9 - Children’s Privacy */}
        <h2 className="text-2xl font-bold">9. Children’s Privacy</h2>
        <p>
          We do not knowingly collect data from children under 18. If you become
          aware of any data we may have collected from children, please contact
          us.
        </p>

        {/* Section 10 - Changes to Privacy Policy */}
        <h2 className="text-2xl font-bold">
          10. Changes to This Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. Any changes will
          be posted on this page.
        </p>

        {/* Section 11 - Contact Us */}
        <h2 className="text-2xl font-bold">11. Contact Us</h2>
        <p>
          If you have any questions, please contact us at{" "}
          <a href="mailto:evento_app@outlook.com" className="underline">
            evento_app@outlook.com
          </a>
          .
        </p>
        <p className="mt-5">Evento, 1 boulevard de Belgique, 98000 Monaco</p>
      </Section>
    </div>
  );
};

export default PrivacyPolicy;
