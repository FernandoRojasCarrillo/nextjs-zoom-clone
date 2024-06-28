import StreamVideoProvider from "@/prividers/streamClienProvider"
import { Metadata } from "next";
import { ReactNode } from "react"

export const metadata: Metadata = {
  title: "YOOM",
  description: "Video Conferencing App",
  icons: {
    icon: "/icons/logo.svg"
  }
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>
        {children}
      </StreamVideoProvider>
    </main>
  )
}

export default RootLayout