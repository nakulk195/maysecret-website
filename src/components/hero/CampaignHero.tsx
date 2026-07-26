import React, { useEffect, useMemo, useState } from 'react';
import { campaign } from '../../config/campaign';
import HeroDesktop from './HeroDesktop';
import HeroMobile from './HeroMobile';
import { CountdownState } from './CampaignCountdown';

type CampaignHeroProps = {
  countdown: CountdownState;
};

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const getBreakpoint = (): Breakpoint => {
  if (typeof window === 'undefined') {
    return 'desktop';
  }

  if (window.matchMedia('(max-width: 767px)').matches) {
    return 'mobile';
  }

  if (window.matchMedia('(max-width: 1023px)').matches) {
    return 'tablet';
  }

  return 'desktop';
};

const CampaignHero: React.FC<CampaignHeroProps> = ({ countdown }) => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() => getBreakpoint());

  useEffect(() => {
    const updateBreakpoint = () => setBreakpoint(getBreakpoint());

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const selectedHeroImage = useMemo(() => {
    if (breakpoint === 'mobile') {
      return campaign.heroMobileImage;
    }

    if (breakpoint === 'tablet') {
      return campaign.heroTabletImage;
    }

    return campaign.heroDesktopImage;
  }, [breakpoint]);

  useEffect(() => {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = selectedHeroImage;
    document.head.appendChild(preloadLink);

    return () => {
      document.head.removeChild(preloadLink);
    };
  }, [selectedHeroImage]);

  if (!campaign.isCampaignActive) {
    return null;
  }

  if (breakpoint === 'mobile') {
    return <HeroMobile countdown={countdown} />;
  }

  return <HeroDesktop countdown={countdown} heroImage={selectedHeroImage} />;
};

export default CampaignHero;
