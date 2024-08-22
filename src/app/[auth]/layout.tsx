import Section from "@/components/layout/Section";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Section className="px-4 w-screen h-screen absolute top-0 left-0 bg-background z-10">
      {children}
    </Section>
  );
};

export default layout;
