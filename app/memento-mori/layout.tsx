import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Memento Mori Calculator – How Many Days Do You Have Left? | 10,000 Hours",
  description: "Calculate your remaining days based on life expectancy. Memento Mori reminds us that life is finite. Use this free tool to gain perspective and make every day count.",
  keywords: [
    "memento mori",
    "memento mori calculator",
    "days left to live calculator",
    "life expectancy calculator",
    "how many days do I have left",
    "mortality calculator",
    "life countdown",
    "death calculator",
    "remaining days calculator",
    "time left calculator"
  ],
  openGraph: {
    title: "Memento Mori – How Many Days Do You Have Left?",
    description: "Life is finite. Calculate your remaining days and transform how you spend each one. Remember you will die.",
    type: "website",
    url: "https://tenthousandhours.app/memento-mori",
    images: [
      {
        url: "/og-memento-mori.png",
        width: 1200,
        height: 630,
        alt: "Memento Mori Calculator - Calculate Your Remaining Days"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Memento Mori – How Many Days Do You Have Left?",
    description: "Life is finite. Calculate your remaining days and transform how you spend each one.",
    images: ["/og-memento-mori.png"]
  },
  alternates: {
    canonical: "https://tenthousandhours.app/memento-mori"
  }
}

export default function MementoMoriLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
