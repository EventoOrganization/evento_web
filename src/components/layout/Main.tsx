// src\components\layout\Main.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface MainProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  bgColor?: string;
  padding?: string;
  fullHeight?: boolean;
}

const Main: React.FC<MainProps> = async ({
  children,
  className,
  id,
  style,
  bgColor = "",
  padding = "",
  fullHeight = true,
}) => {
  return (
    <main
      id={id}
      className={cn(
        className,
        bgColor,
        padding,
        fullHeight ? "min-h-screen" : "",
        "flex flex-col items-center justify-center flex-grow",
      )}
      style={style}
    >
      {children}
    </main>
  );
};

export default Main;
