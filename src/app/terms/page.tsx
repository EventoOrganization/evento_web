import Section from "@/components/layout/Section";
import Link from "next/link";

const Terms = () => {
  return (
    <div className="min-h-screen w-full py-16">
      {/* Section principale */}
      <Section className="max-w-4xl mx-auto space-y-10 px-4 md:px-12">
        <h1 className="text-4xl font-bold text-center">
          TERMS &amp; CONDITIONS
        </h1>
        <p className="text-sm text-center">Last Updated November 13, 2024</p>
        <p>
          Evento (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) provides
          services through our website{" "}
          <Link
            href="http://www.evento-app.io"
            className="underline text-blue-500"
          >
            http://www.evento-app.io
          </Link>{" "}
          and related mobile applications (collectively, the
          &quot;Platform&quot; or &quot;Services&quot;). By accessing or using
          our Services, you agree to comply with these Terms and Conditions. If
          you do not agree to these Terms, you must not use the Services.
        </p>

        {/* Section 1 - Account Registration and Eligibility */}
        <h2 className="self-center">1. Account Registration and Eligibility</h2>
        <ul className="list-disc ml-5 space-y-2">
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
        <h2 className="self-center">2. User Responsibilities</h2>
        <ul className="list-disc ml-5 space-y-2">
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
        <h2 className="self-center">3. Use of the Platform</h2>
        <ul className="list-disc ml-5 space-y-2">
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
        <h2 className="self-center">4. Event Content</h2>
        <ul className="list-disc ml-5 space-y-2">
          <li>
            <strong>Respectful and Non-Discriminatory Events:</strong> Hosts are
            required to ensure that their events are respectful, inclusive, and
            do not discriminate against any individual or group.
          </li>
        </ul>

        {/* Section 5 - Intellectual Property */}
        <h2 className="self-center">5. Intellectual Property</h2>
        <ul className="list-disc ml-5 space-y-2">
          <li>
            All content on the Website and related Services, including logos,
            text, images, and software, is owned by Evento or licensed to us.
          </li>
          <li>
            Users retain ownership of their content but grant Evento a
            non-exclusive, royalty-free license to use, display, and distribute
            the content in connection with the Platform.
          </li>
        </ul>

        {/* Section 6 - Privacy and Data Protection */}
        <h2 className="self-center">6. Privacy and Data Protection</h2>
        <p>
          Your use of the Website is also governed by our{" "}
          <Link href="/privacy-policy" className="underline text-blue-500">
            Privacy Policy
          </Link>
          , which outlines how we collect, use, and protect your personal
          information. By using the Platform, you consent to the collection and
          use of your personal data as described in the Privacy Policy.
        </p>

        {/* Section 7 - Limitation of Liability */}
        <h2 className="self-center">7. Limitation of Liability</h2>
        <ul className="list-disc ml-5 space-y-2">
          <li>
            <strong>No Warranties:</strong> Evento provides the Platform
            &quot;as is&quot; and does not make any warranties regarding its
            functionality, performance, or availability. .
          </li>
          <li>
            <strong>Liability Limit:</strong> Evento&apos;s liability for any
            claims arising from the use of the Platform is limited to the amount
            you have paid to use the services in the past 6 months, if any.
          </li>
          <li>
            <strong>Indemnification:</strong> Users agree to indemnify and hold
            Evento harmless from any claims, losses, damages, or legal fees
            arising from their use of the Platform.
          </li>
        </ul>

        {/* Section 8 - Termination */}
        <h2 className="self-center">8. Termination</h2>
        <ul className="list-disc ml-5 space-y-3">
          <li>
            <strong>By You:</strong> You may terminate your account at any time
            by following the instructions on the Website.
          </li>
          <li>
            <strong>By Us:</strong> We may suspend or terminate your account if
            you violate these Terms or engage in harmful behavior. We reserve
            the right to remove or cancel events at our discretion.
          </li>
        </ul>

        {/* Section 9 - Dispute Resolution */}
        <h2 className="self-center">9. Dispute Resolution</h2>
        <p>
          Any disputes arising from these Terms will be resolved through
          informal negotiation or alternative dispute resolution processes. If a
          resolution cannot be reached, parties may seek appropriate remedies in
          a jurisdiction that is mutually agreed upon.
        </p>

        {/* Section 10 - Disclaimers */}
        <h2 className="self-center">10. Disclaimers</h2>
        <ul className="list-disc ml-5 space-y-3">
          <li>
            <strong>Third-Party Content:</strong> Our Platform may contain links
            to third-party websites or services that are not owned or controlled
            by Evento. We do not assume any responsibility for the content,
            privacy policies, or practices of third-party sites. By using the
            Platform, you acknowledge and agree that we are not responsible for
            any loss or damage caused by your use of any third-party services.
          </li>
          <li>
            <strong>Event Responsibility:</strong> While we provide a platform
            for users to host and attend events, we are not responsible for the
            content, conduct, or safety of any event. Hosts are solely
            responsible for the events they organize, and attendees are
            responsible for their own behavior while attending events.
          </li>
        </ul>

        {/* Section 11 - Modifications */}
        <h2 className="self-center">11. Modifications</h2>
        <p>
          Evento reserves the right to modify, update, or change these Terms at
          any time. Any changes will be posted on this page, with an updated
          “Last Updated” date, and the new Terms will take effect immediately
          upon posting.
        </p>

        {/* Section 12 - Contact Us */}
        <h2 className="self-center">12. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <Link href="mailto:evento_app@outlook.com" className="text-blue-500">
            evento_app@outlook.com
          </Link>
          or by post to: Evento 1, boulevard de Belgique 98000 Monaco.
        </p>
      </Section>
    </div>
  );
};

export default Terms;
