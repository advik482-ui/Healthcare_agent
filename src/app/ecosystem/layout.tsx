import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Buddy Ecosystem - Interactive Health AI Showcase",
  description: "Comprehensive interactive platform showcasing AI-powered health management with real-time data manipulation and personalized health assistance",
};

export default function EcosystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}