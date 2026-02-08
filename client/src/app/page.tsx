'use client';

import Hero from "@/components/landing/Hero";
import SmallDetails from "@/components/landing/SmallDetails";
import WhyItsGood from "@/components/landing/WhyItsGood";
import VideoModal from "@/components/modals/VideoModal";
import { useState } from "react";

export default function Home() {

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const DEMO_VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1";

  return (
    <main className="overflow-x-hidden">
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} url={DEMO_VIDEO_URL} />
      <Hero setIsVideoOpen={setIsVideoOpen} />
      <SmallDetails />
      <WhyItsGood setIsVideoOpen={setIsVideoOpen} />
    </main>
  );
}