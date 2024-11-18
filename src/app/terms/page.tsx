import Section from "@/components/layout/Section";

const Terms = () => {
  return (
    <div className="bg-eventoPurpleDark text-white min-h-screen w-full py-16">
      {/* Section principale */}
      <Section className="max-w-4xl mx-auto space-y-10 px-6 md:px-12">
        <h1 className="text-4xl font-bold text-center">
          TERMS &amp; CONDITIONS
        </h1>
        <p className="text-sm text-center">Last Updated November 15, 2024</p>
        <p>
          Evento (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) provides
          services through our website{" "}
          <a href="http://www.evento-app.io" className="underline">
            http://www.evento-app.io
          </a>{" "}
          and related mobile applications (collectively, the
          &quot;Platform&quot; or &quot;Services&quot;). By accessing or using
          our Services, you agree to comply with these Terms and Conditions. If
          you do not agree to these Terms, you must not use the Services.
        </p>

        {/* Section 1 - Account Registration and Eligibility */}
        <h2 className="text-2xl font-bold">
          1. Account Registration and Eligibility
        </h2>
        <ul className="list-disc ml-5 space-y-3">
          <li>
            You must be at least 18 years old to create an account and use our
            Services.
          </li>
          <li>
            Users are responsible for maintaining the confidentiality of their
            account credentials.
          </li>
          <li>
            You agree to provide accurate, current, and complete information
            when registering or using the Platform.
          </li>
        </ul>

        {/* Section 2 - User Responsibilities */}
        <h2 className="text-2xl font-bold">2. User Responsibilities</h2>
        <ul className="list-disc ml-5 space-y-3">
          <li>
            <strong>Hosts:</strong> You agree to provide accurate event details,
            comply with local laws, and ensure the event is safe and appropriate
            for attendees.
          </li>
          <li>
            <strong>Attendees:</strong> You agree to follow the rules of the
            event and respect other participants. You are responsible for any
            actions taken during events.
          </li>
        </ul>

        {/* Section 3 - Use of the Platform */}
        <h2 className="text-2xl font-bold">3. Use of the Platform</h2>
        <ul className="list-disc ml-5 space-y-3">
          <li>
            <strong>Hosting Events:</strong> As a Host, you are solely
            responsible for organizing, managing, and overseeing your event.
          </li>
          <li>
            <strong>Attending Events:</strong> As an Attendee, you agree to
            attend events in a responsible and respectful manner.
          </li>
          <li>
            <strong>Prohibited Activities:</strong> Users agree not to engage in
            illegal activities, spamming, harassment, or any behavior that may
            harm other users or the Platform&apos;s reputation.
          </li>
        </ul>

        {/* Section 4 - Event Content */}
        <h2 className="text-2xl font-bold">4. Event Content</h2>
        <ul className="list-disc ml-5 space-y-3">
          <li>
            <strong>Respectful and Non-Discriminatory Events:</strong> Hosts are
            required to ensure that their events are respectful, inclusive, and
            do not discriminate against any individual or group.
          </li>
        </ul>

        {/* Section 5 - Intellectual Property */}
        <h2 className="text-2xl font-bold">5. Intellectual Property</h2>
        <p>
          All content on the Website and related Services, including logos,
          text, images, and software, is owned by Evento or licensed to us.
        </p>

        {/* Section 6 - Privacy and Data Protection */}
        <h2 className="text-2xl font-bold">6. Privacy and Data Protection</h2>
        <p>
          Your use of the Website is also governed by our{" "}
          <a href="/privacy-policy" className="underline">
            Privacy Policy
          </a>
          , which outlines how we collect, use, and protect your personal
          information.
        </p>

        {/* Section 7 - Limitation of Liability */}
        <h2 className="text-2xl font-bold">7. Limitation of Liability</h2>
        <ul className="list-disc ml-5 space-y-3">
          <li>
            <strong>No Warranties:</strong> Evento provides the Platform
            &quot;as is&quot;.
          </li>
          <li>
            <strong>Liability Limit:</strong> Evento&apos;s liability is limited
            to the amount you have paid in the past 6 months.
          </li>
          <li>
            <strong>Indemnification:</strong> Users agree to indemnify and hold
            Evento harmless.
          </li>
        </ul>

        {/* Section 8 - Termination */}
        <h2 className="text-2xl font-bold">8. Termination</h2>
        <ul className="list-disc ml-5 space-y-3">
          <li>
            <strong>By You:</strong> You may terminate your account at any time.
          </li>
          <li>
            <strong>By Us:</strong> We may suspend your account if you violate
            these Terms.
          </li>
        </ul>

        {/* Section 9 - Dispute Resolution */}
        <h2 className="text-2xl font-bold">9. Dispute Resolution</h2>
        <p>
          Any disputes will be resolved through informal negotiation or
          alternative dispute resolution processes.
        </p>

        {/* Section 10 - Disclaimers */}
        <h2 className="text-2xl font-bold">10. Disclaimers</h2>
        <p>
          Our Platform may contain links to third-party websites. Evento is not
          responsible for the content or privacy policies of these sites.
        </p>

        {/* Section 11 - Modifications */}
        <h2 className="text-2xl font-bold">11. Modifications</h2>
        <p>
          Evento reserves the right to modify or update these Terms at any time.
        </p>

        {/* Section 12 - Contact Us */}
        <h2 className="text-2xl font-bold">12. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
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

export default Terms;
