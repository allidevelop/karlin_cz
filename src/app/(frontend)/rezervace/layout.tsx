import type { Metadata } from "next";
import { ReservationShell } from "./reservation-shell";

export const metadata: Metadata = {
  title: "Rezervace",
};

export default function ReservationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ReservationShell>{children}</ReservationShell>;
}
