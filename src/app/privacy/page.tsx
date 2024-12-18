import Section from "@/components/layout/Section";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-16 w-full">
      {/* Section principale */}
      <Section className="max-w-4xl mx-auto space-y-6 px-6 md:px-12 items-start  ">
        <h1 className="text-4xl font-bold text-center self-center">
          PRIVACY POLICY
        </h1>
        <p className="text-sm text-center self-center">
          Last Updated November 13, 2024
        </p>
        <p>
          Welcome to Evento (“we,” “our,” or “us”). We respect your privacy and
          are committed to protecting your personal information. This Privacy
          Policy outlines how we collect, store, use, and and protect your
          personal data when you use any of our services (collectively,
          “Services”), such as when you:
        </p>
        <ul className="list-disc ml-5 space-y-3 w-full">
          <li>
            Visit our website at{" "}
            <a
              href="http://www.evento-app.io"
              className="underline text-blue-500"
            >
              http://www.evento-app.io
            </a>{" "}
            (the ‘‘Site’’), or any website or mobile app of ours that links to
            this privacy notice; and/or
          </li>
          <li>
            Engage with us in other related ways, including any sales, marketing
            or events.
          </li>
        </ul>
        <p>
          <b>Questions or Concerns?</b>
          <br />
          Reading this privacy notice will help you understand our privacy
          practices. If you do not agree with our policies and practices, we
          kindly ask that you do not use our services. If you still have
          questions or concerns, please contact us at
          <Link
            href={"mailto:evento_app@outlook.com"}
            target="_blank"
            className="text-blue-500"
          >
            evento_app@outlook.com
          </Link>
          .
        </p>
        {/* Section 1 - Information We Collect */}
        <h2 className="text-2xl font-bold">1. Information We Collect</h2>
        <p>In short: We collect personal information that you provide to us.</p>
        <p>
          We collect different types of information for various purposes to
          provide and improve our Services. This includes:
        </p>
        <span className="flex items-end gap-2">
          <h3 className="font-semibold">A. Personal Data</h3>- provided by you.
        </span>
        <ul className="list-disc ml-5 pb-4 space-y-2">
          <li>
            <b>Name(s)</b>
          </li>
          <li>
            <b>Email address</b>
          </li>
          <li>
            <b>
              Date of Birth, which you can choose to provide when you set up
              your profile
            </b>
          </li>
          <li>
            <b>Social media links</b>
          </li>
          <li>
            <b>Event registration details (if you attend</b> or host events)
          </li>
          <li>
            Other information you may choose to provide to hosts’ event RSVP
            forms
          </li>
        </ul>
        All personal information that you provide to us must be true, complete,
        and accurate, and you must notify us of any changes to such personal
        information.
        <span className="flex items-end gap-2">
          <h3 className="font-semibold">B. Usage Data</h3>- information
          automatically collected.
        </span>
        <p>
          We may also collect information on how you access and use our
          Services.
        </p>
        <p>
          We collect certain data automatically when you visit, use, or browse
          our Services. While this information doesn’t reveal your specific
          identity (like your name or contact details), it may include details
          about your device and usage patterns—such as IP address, browser type,
          device characteristics, operating system, language settings, referring
          URLs, device name, country, general location, and information on how
          and when you interact with our Services. We primarily use this data to
          ensure the security and functionality of our Services, as well as for
          internal analytics and reporting purposes.
        </p>
        <p>This information we collect includes:</p>
        <ul className="list-disc ml-5 space-y-2">
          <li>
            <b>Log and Usage Data:</b> We automatically collect data about your
            interactions with our services, such as the pages you visit, time
            spent on each page, navigation paths, and other usage details. This
            information is used to monitor, analyze, and improve the performance
            and functionality of our services.
          </li>
          <li>
            <b>Device data:</b> We gather details about the device you use to
            access our services, including information such as device type,
            browser type, operating system, and device identifiers. This helps
            us ensure compatibility and improve user experience across different
            devices.
          </li>
          <li>
            <b>Location data</b> (if enabled on your device): we may collect
            information about your general or precise location to personalize
            your experience and enhance service functionality. This data is
            typically derived from your device settings or IP address.
          </li>
        </ul>
        <h2 className="text-2xl font-bold">2. How We Use Your Data</h2>
        <p>We use the collected data for several purposes, including:</p>
        <ul className="list-disc ml-5 space-y-2">
          <li>
            <b>Providing and improving our Services:</b> We use your data to
            deliver and support the services you request, manage event
            functionalities, and continually enhance our offerings.
          </li>
          <li>
            <b>Account Admin:</b> To help facilitate account creation, maintain
            authentication, and manage user accounts as part of our contractual
            obligations to you.
          </li>
          <li>
            <b>Communication:</b> To send you event confirmations, updates,
            marketing materials, and promotional offers (you can opt-out of
            marketing emails at any time).
          </li>
          <li>
            <b>Customer support:</b> To address inquiries and resolve any issues
            you may experience with our services.
          </li>
          <li>
            <b>Analytics & Service Monitoring:</b> To gain insights into user
            behavior and interactions with our site, allowing us to improve
            functionality, monitor performance, and enhance the user experience.
          </li>
          <li>
            <b>Legal compliance:</b> To comply with legal obligations, resolve
            disputes, and enforce agreements.
          </li>
          <li>
            <b>Safety and Security:</b> To protect our platform and users by
            investigating, detecting, and preventing fraudulent, unauthorized,
            or illegal activity.
          </li>
          <li>
            <b>Compliance and Legal Obligations:</b> To comply with legal
            requirements, address disputes, and enforce agreements. This may
            include auditing for compliance with internal policies and legal
            obligations or defending against legal claims.
          </li>
          <li>
            <b>Research and Development:</b> We may use anonymized or aggregated
            data for research and development purposes, analyzing trends to
            improve our services and add new features for the benefit of our
            users.
          </li>
        </ul>
        {/* Section 3 - GDPR Compliance */}
        <h2 className="text-2xl font-bold">
          3. Legal Basis for Processing Your Data (GDPR Compliance)
        </h2>
        <p>
          In compliance with the General Data Protection Regulation (GDPR), we
          only process your personal data when we have a lawful basis to do so.
          Our legal bases for processing your data include the following:
        </p>
        <ul className="list-disc ml-5 space-y-2">
          <li>
            <b>Consent:</b> We will ask for your consent before processing
            certain types of personal data. For instance, if you sign up for
            newsletters, create an account, register for an event, or otherwise
            agree to share your information with us, we rely on your explicit
            consent. You can withdraw this consent at any time, although doing
            so may affect your ability to use some features of our Services.
          </li>
          <li>
            <b>Contractual necessity:</b> When you register for an event or sign
            up for our Services, we process your data to fulfill the contract we
            have with you. This means we need to collect and use certain
            personal information to manage your account, process event
            registrations, and provide the requested Services. Without this
            data, we would be unable to deliver these Services effectively.
          </li>
          <li>
            <b>Legitimate interests:</b> In some instances, we process your data
            based on our legitimate business interests. This allows us to
            improve and optimize our Services, communicate important updates,
            and enhance user experience. We may also use this basis to detect
            and prevent fraud, secure the platform, and ensure the safety of our
            users. When we process data under legitimate interests, we ensure
            that this does not override your privacy rights and freedoms.
          </li>
          <li>
            <b>Legal obligations:</b> We may process your data as required by
            applicable laws or regulations, such as retaining information for
            tax, legal reporting, or auditing purposes. Additionally, we may
            need to disclose data in response to valid legal requests, such as
            subpoenas or regulatory demands, to protect our rights, and to
            comply with court orders or law enforcement requests.
          </li>
        </ul>
        {/* Section 4 - Data Sharing */}
        <h2 className="text-2xl font-bold">4. How We Share Your Data</h2>
        <p>
          We do not sell, rent, or trade your personal information to third
          parties. However, we may share your data with the following entities:
        </p>
        <ul className="list-disc ml-5 space-y-2">
          <li>
            <b>Vendors, consultants and other third-party service providers:</b>{" "}
            We may share your information with third-party service providers
            (e.g., payment processors, email marketing platforms, hosting
            services) who assist us in providing our Services. These parties are
            bound by confidentiality agreements.
          </li>
          <li>
            <b>Professional advisors:</b> Professional Advisors: In certain
            situations, we may disclose personal information to professional
            advisors, including lawyers, auditors, bankers, and insurers, as
            needed for the specialized services they provide to us.
          </li>
          <li>
            <b>Legal requirements:</b> We may disclose your information to
            comply with a legal obligation, such as responding to a subpoena or
            government request.
          </li>
          <li>
            <b>Business transfers:</b> In the event of a merger, acquisition, or
            sale of assets, your personal data may be transferred.
          </li>
        </ul>
        {/* Section 5 - Data Retention */}
        <h2 className="text-2xl font-bold">5. Data Retention</h2>
        <p>
          We will retain your personal data for as long as necessary to fulfill
          the purposes outlined in this Privacy Policy unless otherwise required
          by law.
        </p>
        <p>
          If you would like, at any time, to review or change the information in
          your account or terminate your account, you can. Upon your request to
          terminate your account, we will deactivate or delete your account and
          information on our active databases. If you no longer wish to use our
          Services or want us to delete your data, you can request its removal
          by contacting us at
          <Link
            href={"mailto:evento_app@outlook.com"}
            className="text-blue-500"
          >
            evento_app@outlook.com
          </Link>
          .
        </p>
        <p>
          However, we may retain some information in our files to prevent fraud,
          troubleshoot problems, assist with any investigations, enforce our
          legal terms, and/or comply with applicable legal requirements.
        </p>
        {/* Section 6 - Security of Your Data */}
        <h2 className="text-2xl font-bold">6. Security of Your Data</h2>
        <p>
          We take the security of your personal data seriously and use
          commercially acceptable means to protect it.{" "}
        </p>
        <p>
          However, despite our efforts to secure your information, no electronic
          transmission over the Internet or information storage technology can
          be guaranteed to be 100% secure, so we cannot promise or guarantee
          that hackers, cybercriminals, or other unauthorized third parties will
          not be able to defeat our security and improperly collect, access,
          steal, or modify your information. Transmission of personal
          information to and from our Services is at your own risk. You should
          only access the Services within a secure environment.
        </p>
        {/* Section 7 - Your Data Protection Rights */}
        <h2 className="text-2xl font-bold">7. Your Data Protection Rights</h2>
        <p>As a user, you have the following rights under GDPR:</p>
        <ul className="list-disc ml-5 space-y-2">
          <li>
            <b>Information:</b> You can have information about how we have
            collected and used personal information. We have made this
            information available to you without having to request it by
            including it in this Privacy Policy.
          </li>
          <li>
            <b>Access:</b> You can request access to copies of your personal
            data.
          </li>
          <li>
            <b>Rectification:</b> You can request that we correct any
            information you believe is inaccurate or incomplete.
          </li>
          <li>
            <b>Deletion:</b> You can request that we erase your personal data,
            under certain conditions.
          </li>
          <li>
            <b>Restriction of processing:</b> You can request that we restrict
            the processing of your personal data, under certain conditions.
          </li>
          <li>
            <b>Data portability:</b> You can request that we transfer the data
            you provided to another organization, or to you, under certain
            conditions.
          </li>
          <li>
            <b>Objection:</b> You can object to our processing of your personal
            data, in certain situations.
          </li>
        </ul>
        <p>
          To exercise these rights, please contact us at
          <Link
            href={"mailto:evento_app@outlook.com"}
            className="text-blue-500"
          >
            evento_app@outlook.com
          </Link>
          .
        </p>
        <p>
          We may ask for specific information from you to help us confirm your
          identity. Depending on where you reside, you may be entitled to
          empower an authorized agent to submit requests on your behalf. We will
          require authorized agents to confirm their identity and authority, in
          accordance with applicable laws. You are entitled to exercise the
          rights described above free from discrimination.
        </p>
        {/* Section 8 - Third-Party Websites */}
        <h2 className="text-2xl font-bold">8. Third-Party Websites</h2>
        <p>
          Our Site may contain links to third-party websites or services that
          are not operated by us. If you click on a third-party link, you will
          be directed to that third party&apos;s website. We encourage you to
          review the privacy policy of every site you visit. We have no control
          over and assume no responsibility for the content, privacy policies,
          or practices of third-party sites or services.
        </p>
        {/* Section 9 - Children’s Privacy */}
        <h2 className="text-2xl font-bold">9. Children’s Privacy</h2>
        <p>
          We do not knowingly solicit data from or market to children under 18
          years of age. By using the Services, you represent that you are at
          least 18 or that you are the parent or guardian of such a minor and
          consent to such minor dependent’s use of the Services. If we become
          aware that information from users less than 18 years of age has been
          collected, we will take steps to delete such information from our
          records.
        </p>
        <p>
          If you become aware of any data we may have collected from children
          under age 18, please contact us at{" "}
          <Link
            href={"mailto:evento_app@outlook.com"}
            className="text-blue-500"
          >
            evento_app@outlook.com
          </Link>
          .
        </p>
        {/* Section 10 - Changes to Privacy Policy */}
        <h2 className="text-2xl font-bold">
          10. Changes to This Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. Any changes will
          be posted on this page with an updated “Last Updated” date. We
          encourage you to review this Privacy Policy periodically for any
          updates or changes.
        </p>
        {/* Section 11 - Contact Us */}
        <h2 className="text-2xl font-bold">11. Contact Us</h2>
        <p>
          If you have any questions or comments about this Privacy Policy or the
          way we handle your personal data, please email us at{" "}
          <Link
            href="mailto:evento_app@outlook.com"
            className="text-blue-500 mr-2"
          >
            evento_app@outlook.com
          </Link>
          or by post to: Evento 1, boulevard de Belgique 98000 Monaco
        </p>
        <p className="mt-5">Evento, 1 boulevard de Belgique, 98000 Monaco</p>
      </Section>
    </div>
  );
};

export default PrivacyPolicy;
