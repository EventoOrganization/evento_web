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
      <Section className="max-w-4xl mx-auto space-y-10 px-4 md:px-12">
        {/* Getting Started */}
        <h1 className="text-4xl font-bold text-center text-eventoPurple">
          FAQs
          <span className="hidden md:block ml-2">
            - Frequently Asked Questions
          </span>
        </h1>
        <h2>Getting started</h2>
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
          title="❓ What is a PWA, and how does it work?"
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
        <h2>Inviting guests</h2>

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
        <h2>Managing and editing your event</h2>

        <Accordion
          title="🔒 Can I make my event private?"
          content="Yes! When creating an event, you can choose between “Public” and “Private” in event type. Private events are only visible to those who receive a direct invitation."
        />

        <Accordion
          title="📝 Can I edit my event after creating it?"
          content="Yes, you can edit your event details anytime before it starts. Just go to your event page, select 'Edit Event,' (📝) make your changes, and save. Keep in mind that guests will be notified of any major updates."
        />

        <Accordion
          title="👥 Can I add a co-host to help manage the event?"
          content="Yes, you can add co-hosts to assist in managing guest lists, sending invites, and communicating with attendees. Just go to your event, then 'Edit Event' and add a co-host by entering their email or username on Evento."
        />

        <Accordion
          title="✅ Can I add an RSVP?"
          content="With Evento, keeping track of attendees is a breeze! When you create an event, simply enable the RSVP feature to see who’s coming in real time. This tool gives you a clear view of your guest list, making it easy to plan. Just go to the event setup and toggle on 'Add an RSVP' to get started!"
        />
        <Accordion
          title="📋 How does the RSVP work?"
          content={
            <>
              Design your RSVP to suit your needs. Click on &quot;Add a
              Question&quot; and choose a format:
              <ul className="list-disc ml-5 my-4 space-y-2">
                <li>
                  <b>Text Answer:</b> Guests can type a response.
                </li>
                <li>
                  <b>Multiple Choice:</b> Give guests options to choose one
                  response.
                </li>
                <li>
                  <b>Checkboxes:</b> Let guests select multiple answers.
                </li>
              </ul>
              Want a response from everyone? Switch on the toggle &quot;Answer
              Required.&quot;
            </>
          }
        />

        {/* Discovering Events */}
        <h2>Discovering events</h2>

        <Accordion
          title="🔍 How do I find events to join?"
          content={
            <>
              To get started, go to:{" "}
              <Link
                href="https://www.evento-app.io/discover"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                https://www.evento-app.io/discover
              </Link>
              . In the Evento app, browse through our “Discover events” section,
              where you can view available events based on your interests,
              location, and connections. You’ll only see events that are public
              and open to you, so every option will be a fit for your network
              and interests.
            </>
          }
        />

        <Accordion
          title="💜 How can I find events that match my interests?"
          content={
            <>
              On the &quot;Discover events page&quot;, you can search by{" "}
              <b>interest, location, or keyword</b> to find events that suit
              your preferences. This makes it easy to browse events in specific
              genres or nearby locations.
            </>
          }
        />

        <Accordion
          title="⭐️ Can I save events to view later?"
          content="Yes, you can bookmark or save events you’re interested in. This feature allows you to revisit and keep track of upcoming events that you may want to join. "
        />

        {/* Community Guidelines */}
        <h2>Community and Content Guidelines</h2>

        <Accordion
          title="✅ Are there any guidelines for creating events on Evento?"
          content="Yes, Evento aims to create a safe and welcoming space for everyone. We encourage hosts to create inclusive, respectful gatherings. Events that involve illegal activities, harassment, or otherwise violate our community standards are strictly prohibited."
        />
        <h2>Account and Payment</h2>
        <Accordion
          title="🆓 Is Evento free to use?"
          content="Yes, Evento offers a free version with essential features for creating and managing events."
        />
        <Accordion
          title="🔐 How do I reset my password?"
          content="If you need to reset your password, go to the login page, click on 'Settings' and follow the instructions sent to your email. If you encounter any issues, reach out to our support team for assistance."
        />
        <Accordion
          title="🗑 Can I delete my account?"
          content="If you’d like to delete your account, please go to your profile, click on 'Settings,'' and select 'Delete Account.' Note that this action is permanent and will erase all your event history and data.
"
        />
        {/* Troubleshooting and Support */}
        <h2>Troubleshooting and Support</h2>

        <Accordion
          title="📍 What if the event location isn’t displaying correctly?"
          content={
            <>
              If you experience issues with location settings, try refreshing
              your browser or app. Ensure your device’s location services are
              enabled, and that you&apos;ve entered the address accurately. If
              issues persist, contact Evento support for assistance. You can
              contact support directly by clicking the <b>helpdesk icon</b> at
              the bottom right. You can also email us at:{" "}
              <Link
                href="mailto:help@evento-app.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                help@evento-app.io.
              </Link>
            </>
          }
        />
        <Accordion
          title="🔧 I’m having trouble with the app. What should I do?"
          content={
            <>
              We&apos;re here to help! Start by checking your internet
              connection and making sure you’re using the latest version of the
              app. If the issue persists, you can reach out. You can contact
              support directly by clicking the <b>helpdesk icon</b> at the
              bottom right. You can also email us at:{" "}
              <Link
                href="mailto:help@evento-app.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                help@evento-app.io.
              </Link>
            </>
          }
        />

        <Accordion
          title="📞 How can I contact support?"
          content={
            <>
              You can contact support directly by clicking the{" "}
              <b>helpdesk icon</b> at the bottom right of our platform:
              www.evento-app.io. Our team typically responds within 24 hours.
              You can also email us at:{" "}
              <Link
                href="mailto:help@evento-app.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                help@evento-app.io.
              </Link>
              .
            </>
          }
        />

        {/* Feedback */}
        <h2>Feedback and Suggestions</h2>

        <Accordion
          title="💬 How can I provide feedback about my experience with Evento?"
          content="We love hearing from our users! You can share feedback directly within the app by navigating to 'Settings' and selecting 'Send Feedback.' We’re always looking for ways to improve and appreciate your insights."
        />
      </Section>
    </div>
  );
};

export default Faq;
