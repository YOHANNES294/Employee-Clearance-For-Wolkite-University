import Admin from "@/components/Dashboard/Admin";
import { Metadata } from "next";

export const metadata = {
  title: "WKU-ECMS | Admin ",
  description: "This is a employee clearance mangement system for wolkite university.",
  // other metadata
};

export default function Home() {
  return (
    <>
      <Admin />
    </>
  );
}
