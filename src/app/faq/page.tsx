"use client";
import ComingSoon from "@/components/ComingSoon";
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
        <h1 className="text-4xl font-bold text-center text-eventoPurple">
          Getting Started
        </h1>

        <Accordion
          title="How do I create an event?"
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
              . Login to your Evento account, click on &quot;Create Event&quot;,
              and fill out all the details like title, description, location,
              and date. Once you&apos;ve set everything up, you can send
              invitations to your guest list.
            </>
          }
        />

        <Accordion
          title="Does Evento work on both mobile and desktop?"
          content="Yes, Evento is available as a mobile app and is accessible via a web browser on desktop. Both platforms offer a similar experience, so you can manage your events from whichever device is convenient for you. To download the PWA version go to your Profile Settings."
        />

        <Accordion
          title="How do I download the app?"
          content={
            <>
              Downloading Evento as a PWA (Progressive Web App) is simple and
              doesn&apos;t require going through an app store.
              <ol className="list-decimal ml-5 mt-4 space-y-2">
                <li>
                  <b>Visit the Evento Profile Page:</b> Start by going to&nbsp;
                  <Link
                    href="https://www.evento-app.io/profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    https://www.evento-app.io/profile
                  </Link>{" "}
                  in your web browser.
                </li>
                <li>
                  <b>Access Settings:</b> Once on your profile page, click on
                  &quot;Settings.&quot;
                </li>
                <li>
                  <b>Click on &quot;Install PWA&quot;:</b> In the Settings menu,
                  look for the &quot;Install PWA&quot; option and click it. This
                  will prompt your device to install the Evento app.
                </li>
                <li>
                  <b>Follow On-Screen Instructions:</b> You may be prompted to
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
              <p>
                A PWA, or Progressive Web App, is a type of web application that
                can be installed on your device, just like a traditional app.
                Here&apos;s how it works and why it&apos;s useful:
              </p>
              <ol className="list-decimal ml-5 mt-4 space-y-2">
                <li>
                  <b>Works Like a Native App:</b> Once installed, Evento&apos;s
                  PWA appears on your home screen or desktop and opens in its
                  own window. You&apos;ll have easy access to all features
                  without needing to open a browser or enter the website address
                  every time.
                </li>
                <li>
                  <b>Automatic Updates: </b> Unlike app store apps, PWAs update
                  automatically in the background whenever you&apos;re connected
                  to the internet. This ensures you always have the latest
                  features without needing to install updates manually.
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
              </ol>
              <p className="mt-4">
                Using Evento as a PWA gives you the convenience of an app
                without the need for an app store download, making it perfect
                for users who want an easy way to access their events anytime,
                anywhere.
              </p>
            </>
          }
        />

        <h1 className="text-4xl font-bold text-center text-eventoPurple mt-12">
          Managing and Editing your Events
        </h1>

        <ComingSoon />

        <h1 className="text-4xl font-bold text-center text-eventoPurple mt-12">
          Troubleshooting and Support
        </h1>

        <ComingSoon />

        <h1 className="text-4xl font-bold text-center text-eventoPurple mt-12">
          Feedback and Suggestions
        </h1>

        <ComingSoon />
      </Section>
    </div>
  );
};

export default Faq;
