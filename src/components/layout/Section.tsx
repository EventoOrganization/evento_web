// src\components\layout\Section.tsx
import { cn } from "@/lib/utils";
import React from "react";

const Section = ({
  children,
  className,
  bgImg,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  bgImg?: string;
  id?: string;
}) => {
  return (
    <section
      className={cn(
        "flex items-center justify-center flex-col flex-grow w-full relative py-10 px-4",
        className,
      )}
      id={id}
    >
      {children}
    </section>
  );
};

export default Section;
