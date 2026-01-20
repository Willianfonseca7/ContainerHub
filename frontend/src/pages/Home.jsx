import React from 'react';
import HomeHero from '../components/domain/HomeHero';
import MobileManagement from '../components/domain/MobileManagement';
import PremiumCameraCard from '../components/domain/PremiumCameraCard';
import HowItWorks from '../components/domain/HowItWorks';
import WhyContainerHub from '../components/domain/WhyContainerHub';
import HomeCTA from '../components/domain/HomeCTA';

export default function Home() {
  return (
    <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] bg-gradient-to-b from-[#FAFAFA] via-white to-[#FAFAFA] dark:bg-gradient-to-b dark:from-[#020617] dark:via-[#020617] dark:to-[#020617]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        <HomeHero />
        <MobileManagement />
        <PremiumCameraCard />
        <HowItWorks />
        <WhyContainerHub />
        <HomeCTA />
      </div>
    </div>
  );
}
