import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlightFare — Rahul R",
  description: "Flight Price Prediction — XGBoost + LightGBM Ensemble | R² 0.9405",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
