import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { campaign } from '../../config/campaign';
import CampaignCountdown, { CountdownState } from './CampaignCountdown';

type HeroDesktopProps = {
  countdown: CountdownState;
  heroImage: string;
};

const HeroDesktop: React.FC<HeroDesktopProps> = ({ countdown, heroImage }) => {
  const [heroOffset, setHeroOffset] = useState({ x: 0, y: 0 });

  const handleHeroPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
    setHeroOffset({ x, y });
  };

  const handleHeroPointerLeave = () => {
    setHeroOffset({ x: 0, y: 0 });
  };

  return (
    <section
      className="campaign-hero relative hidden w-full overflow-hidden text-white md:block"
      onPointerMove={handleHeroPointerMove}
      onPointerLeave={handleHeroPointerLeave}
      style={{
        backgroundImage: campaign.gradientColors.hero,
        ['--campaign-primary' as string]: campaign.accentColors.primary,
        ['--campaign-secondary' as string]: campaign.accentColors.secondary,
        ['--campaign-accent' as string]: campaign.accentColors.accent,
      }}
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src={campaign.backgroundImage}
          alt=""
          className="campaign-hero-background h-full w-full object-cover"
          loading="lazy"
        />
        {campaign.backgroundEffects.rain && <div className="campaign-rain-layer" />}
        {campaign.backgroundEffects.glow && (
          <>
            <motion.div
              animate={{ x: [0, 22, 0], y: [0, -18, 0], opacity: [0.3, 0.52, 0.3] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-[-10%] top-12 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -18, 0], y: [0, 18, 0], opacity: [0.24, 0.44, 0.24] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[-12%] right-[-6%] h-80 w-80 rounded-full bg-sky-400/25 blur-3xl"
            />
          </>
        )}
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-10 md:min-h-[700px] lg:min-h-[680px] lg:grid-cols-[0.96fr_1.04fr] lg:px-12">
        <div className="z-10 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-4 inline-flex items-center rounded-full border border-emerald-200/30 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.22em] text-emerald-100 shadow-sm backdrop-blur-md"
          >
            {campaign.campaignLabel}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-3 text-5xl font-extrabold leading-[1.02] text-white lg:text-6xl"
          >
            {campaign.heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-4 text-2xl font-semibold text-emerald-100"
          >
            {campaign.subHeading}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 max-w-xl text-base leading-relaxed text-white/78 lg:text-lg"
          >
            {campaign.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mb-6 flex flex-row gap-3"
          >
            <button
              type="button"
              onClick={() => window.location.href = campaign.primaryCTA.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-gray-950 shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-100"
            >
              {campaign.primaryCTA.label}
              <ArrowRight className="h-4 w-4" />
            </button>
            {campaign.showSecondaryCTA && (
              <button
                type="button"
                onClick={() => window.location.href = campaign.secondaryCTA.href}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200/60 hover:bg-white/16"
              >
                {campaign.secondaryCTA.label}
              </button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-5 flex flex-wrap gap-2"
          >
            {campaign.offerChips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/86 shadow-sm backdrop-blur-md"
              >
                <Check className="h-3.5 w-3.5 text-emerald-200" />
                {chip}
              </span>
            ))}
          </motion.div>

          {campaign.showCountdown && campaign.countdownEnabled && <CampaignCountdown countdown={countdown} />}
        </div>

        <div className="relative z-10 flex min-h-[440px] min-w-0 items-center justify-center lg:min-h-[560px]">
          {campaign.showOfferBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
              animate={{ opacity: 1, scale: 1, rotate: 5 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="campaign-discount-badge absolute left-4 top-3 z-20 lg:left-0"
            >
              <span>{campaign.heroBadge.eyebrow}</span>
              <strong>{campaign.offerPercentage}%</strong>
              <span>{campaign.heroBadge.suffix}</span>
            </motion.div>
          )}

          {campaign.showFloatingComboCard && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="campaign-combo-card absolute bottom-2 right-6 z-20 w-60 overflow-hidden rounded-3xl border border-emerald-100/25 bg-slate-950/58 shadow-2xl backdrop-blur-xl"
            >
              <img
                src={campaign.featuredPromoMedia}
                alt={campaign.featuredComboName}
                className="h-24 w-full object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-100">{campaign.featuredComboName}</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-2xl font-black text-white">{campaign.featuredComboPrice}</span>
                  <span className="pb-1 text-sm font-semibold text-white/45 line-through">{campaign.featuredComboOriginalPrice}</span>
                </div>
                <p className="mt-1 text-sm font-bold text-emerald-200">{campaign.featuredComboSavings}</p>
                <button
                  type="button"
                  onClick={() => window.location.href = campaign.secondaryCTA.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-white transition-colors hover:text-emerald-100"
                >
                  {campaign.featuredComboCtaText}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          <motion.div
            className="campaign-hero-media-wrap relative w-full"
            animate={{
              x: heroOffset.x,
              y: heroOffset.y,
              scale: heroOffset.x || heroOffset.y ? 1.012 : 1,
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 22 }}
          >
            <div className="campaign-product-glow" aria-hidden="true" />
            <motion.img
              src={heroImage}
              alt={campaign.heroMediaAlt}
              loading="eager"
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{ opacity: { duration: 0.55 }, scale: { duration: 0.55 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
              className="campaign-hero-media relative w-full object-contain"
            />
          </motion.div>
        </div>

        {campaign.showTrustStrip && (
          <div className="absolute bottom-0 left-0 right-0 z-10 hidden border-t border-white/12 bg-slate-950/34 px-4 py-3 backdrop-blur-md md:block">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {campaign.trustPoints.map((point) => (
                <span key={point} className="inline-flex items-center gap-2 text-sm font-bold text-white/82">
                  <Check className="h-4 w-4 text-emerald-200" />
                  {point}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroDesktop;
