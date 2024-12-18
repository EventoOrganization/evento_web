"use client";
import Section from "@/components/layout/Section";
import Link from "next/link";
import { useState } from "react";

const Accordion = ({
  title,
  content,
}: {
  title: string;
  content: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-eventoPurpleDark py-4 w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-eventoPurpleDark hover:text-eventoPurple transition-colors"
      >
        <span>{title}</span>
        <span>{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen && <div className="mt-4 text-gray-700">{content}</div>}
    </div>
  );
};

const Faq = () => {
  return (
    <div className="min-h-screen py-16 w-full">
      <Section className="max-w-4xl mx-auto space-y-10 px-6 md:px-12">
        {/* Getting Started */}
        <h1 className="text-4xl font-bold text-center text-eventoPurple">
          FAQs - Getting Started
        </h1>

        <Accordion
          title="🎉 How do I create an event?"
          content={
            <>
              To get started, go to:&nbsp;
              <Link
                href="https://www.evento-app.io/create-event"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                https://www.evento-app.io/create-event
              </Link>
              . Log in, click &quot;Create Event,&quot; and fill out details
              like title, description, location, and date. Then send invitations
              to your guest list!
            </>
          }
        />

        <Accordion
          title="🖥 Does Evento work on both mobile and desktop?"
          content="Yes, Evento is available as a mobile app and a web app. Both platforms offer a similar experience, so you can manage events conveniently."
        />

        <Accordion
          title="📲 How do I download the app?"
          content={
            <>
              Downloading Evento as a PWA (Progressive Web App) is simple and
              doesn’t require going through an app store.
              <br />
              Here’s how you can install it directly onto your device for a
              smooth, app-like experience: Visit the Evento Profile Page: Start
              by going to https://www.evento-app.io/profile in
              <ol className="list-decimal ml-5 mt-4 space-y-2">
                <li>
                  <b>Visit the Evento Profile Page: </b> Start by going to your{" "}
                  <Link
                    href=" https://www.evento-app.io/profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    Profile Page
                  </Link>{" "}
                  in your web browser. .
                </li>
                <li>
                  <b>Access Settings: </b>Once on your profile page, click on
                  &quot;Settings.&quot;
                </li>
                <li>
                  <b>
                    Click on &quot;Install PWA:&quot; In the Settings menu, look
                    for the &quot;Install PWA&quot; option and click it. This
                    will prompt your device to install the Evento app.
                  </b>
                </li>
                <li>
                  <b>Follow On-Screen Instructions: </b>You may be prompted to
                  add Evento to your home screen (on mobile) or as a shortcut on
                  your desktop.
                </li>
              </ol>
            </>
          }
        />

        <Accordion
          title="What is a PWA, and how does it work?"
          content={
            <>
              A PWA, or Progressive Web App, is a type of web application that
              can be installed on your device, just like a traditional app.
              Here’s how it works and why it’s useful:
              <ul className="list-disc m-5  space-y-2">
                <li>
                  <b>Works Like a Native App:</b> Once installed, Evento’s PWA
                  appears on your home screen or desktop and opens in its own
                  window. You’ll have easy access to all features without
                  needing to open a browser or enter the website address every
                  time.
                </li>
                <li>
                  <b>Automatic Updates:</b> Unlike app store apps, PWAs update
                  automatically in the background whenever you’re connected to
                  the internet. This ensures you always have the latest features
                  without needing to install updates manually.
                </li>
                <li>
                  <b>Offline Access:</b> PWAs are designed to work even with
                  limited connectivity. Once you&apos;ve loaded your event
                  information, you&apos;ll be able to access key details and
                  RSVP statuses offline.
                </li>
                <li>
                  <b>Lightweight and Fast:</b> PWAs use less storage space than
                  traditional apps, so they won&apos;t take up much room on your
                  device. They&apos;re also optimized for fast loading,
                  providing a seamless user experience.
                </li>
              </ul>
              Using Evento as a PWA gives you the convenience of an app without
              the need for an app store download, making it perfect for users
              who want an easy way to access their events anytime, anywhere.
            </>
          }
        />

        {/* Inviting Guests */}
        <h1 className="text-4xl font-bold text-center text-eventoPurple mt-12">
          Inviting Guests
        </h1>

        <Accordion
          title="📩 How can I invite guests to my event?"
          content={
            <>
              Once your event is created, there are three easy ways to invite
              guests:
              <ol className="list-decimal ml-5 mt-4 space-y-2">
                <li>
                  <b>Invite Directly on Evento:</b> If your guests are already
                  on Evento, you can send them a direct invite on the platform.
                </li>
                <li>
                  <b>Share a Unique Event Link:</b> You’ll also get a unique
                  link to your event, which you can share with anyone through
                  social media, email, or messaging apps.
                </li>
                <li>
                  <b>Invite by Email:</b> Add guests by entering their email
                  addresses, and they’ll receive an invitation to join the
                  event.
                </li>
              </ol>
            </>
          }
        />

        <Accordion
          title="📋 Can I bulk upload a list of guests?"
          content={
            <>
              Yes! Here’s how you can do it in a few easy steps:
              <ol className="list-decimal ml-5 mt-4 space-y-2">
                <li>
                  <b>Go to Your Event Page:</b> Open the event to which you’d
                  like to invite guests.
                </li>
                <li>
                  <b>Select &quot;Add Guests&quot;:</b> Click on the &quot;Add
                  Guests&quot; option to open the guest list settings.
                </li>
                <li>
                  <b>Choose &quot;Import in Bulk&quot;:</b> In the guest list
                  menu, select the &quot;Import in Bulk&quot; option.
                </li>
                <li>
                  <b>Upload a CSV File:</b> Upload your list as a CSV file. Be
                  sure that your file includes each guest&apos;s name and email
                  address in separate columns for a smooth import. (Tip: Make
                  sure the file follows standard formatting with names and
                  emails organized in rows.)
                </li>
              </ol>
            </>
          }
        />

        <Accordion
          title="🤝 Can guests invite friends to my event?"
          content="Yes! You can allow guests to invite their own friends, broadening your event’s reach and fostering more connections. After creating an event, simply toggle the option ‘‘allow guests to invite guests’’ to enable friend invitations."
        />

        {/* Managing and Editing Events */}
        <h1 className="text-4xl font-bold text-center text-eventoPurple mt-12">
          Managing and editing your event
        </h1>

        <Accordion
          title="Can I make my event private?"
          content='Yes, select "Private" in the event type when creating it. Only invited guests will see private events.'
        />

        <Accordion
          title="Can I edit my event after creating it?"
          content="Yes, go to 'Edit Event' on your event page. Guests will be notified of major changes."
        />

        <Accordion
          title="Can I add a co-host?"
          content="Yes! Add co-hosts under 'Edit Event' by entering their email or username."
        />

        <Accordion
          title="Can I add an RSVP?"
          content="Enable 'Add an RSVP' during event creation to track attendees in real-time. Customize RSVP questions with text, multiple-choice, or checkboxes."
        />

        {/* Discovering Events */}
        <h1 className="text-4xl font-bold text-center text-eventoPurple mt-12">
          Discovering Events
        </h1>

        <Accordion
          title="How do I find events to join?"
          content={
            <>
              Browse the &quot;Discover Events&quot; section at&nbsp;
              <Link
                href="https://www.evento-app.io/discover"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                https://www.evento-app.io/discover
              </Link>
              .
            </>
          }
        />

        <Accordion
          title="How can I find events that match my interests?"
          content="Search by interest, location, or keywords in the 'Discover Events' section."
        />

        <Accordion
          title="Can I save events to view later?"
          content="Yes, bookmark events to revisit them later."
        />

        {/* Community Guidelines */}
        <h1 className="text-4xl font-bold text-center text-eventoPurple mt-12">
          Community and Content Guidelines
        </h1>

        <Accordion
          title="Are there guidelines for creating events?"
          content="Yes, events must adhere to community standards. Illegal activities, harassment, or offensive content are prohibited."
        />

        {/* Troubleshooting and Support */}
        <h1 className="text-4xl font-bold text-center text-eventoPurple mt-12">
          Troubleshooting and Support
        </h1>

        <Accordion
          title="What if the event location isn’t displaying correctly?"
          content="Refresh your browser, enable location services, and verify the address. Contact support if the issue persists."
        />

        <Accordion
          title="How can I contact support?"
          content="Submit a request via the 'Help' section in the app or email evento_app@outlook.com."
        />

        {/* Feedback */}
        <h1 className="text-4xl font-bold text-center text-eventoPurple mt-12">
          Feedback and Suggestions
        </h1>

        <Accordion
          title="How can I provide feedback?"
          content="Share your feedback via 'Send Feedback' under Settings in the app. We value your input to improve Evento!"
        />
      </Section>
    </div>
  );
};

export default Faq;
