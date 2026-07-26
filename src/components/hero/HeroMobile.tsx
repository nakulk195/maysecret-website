import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
import { campaign } from '../../config/campaign';
import CampaignCountdown, { CountdownState } from './CampaignCountdown';

type HeroMobileProps = {
  countdown: CountdownState;
};

const HeroMobile: React.FC<HeroMobileProps> = ({ countdown }) => {
  return (
    <section
      className="campaign-hero-mobile relative overflow-hidden px-4 pb-6 pt-5 text-white md:hidden"
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
          className="campaign-mobile-bg h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-md flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-2"
        >
          <p className="inline-flex rounded-full border border-emerald-200/30 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-100 shadow-sm backdrop-blur-md">
            {campaign.campaignLabel}
          </p>
          <div>
            <h1 className="text-[2.25rem] font-black leading-[0.98] text-white min-[390px]:text-[2.55rem]">
              {campaign.heading}
            </h1>
            <p className="mt-1 text-base font-semibold text-emerald-100">{campaign.subHeading}</p>
          </div>
          {campaign.showOfferBadge && (
            <div className="inline-flex items-center rounded-full border border-amber-200/40 bg-amber-300/14 px-3 py-1.5 text-sm font-black uppercase tracking-[0.08em] text-amber-100">
              Up to {campaign.offerPercentage}% OFF
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: [0, -4, 0] }}
          transition={{ opacity: { duration: 0.4, delay: 0.1 }, y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } }}
          className="campaign-mobile-product-card"
        >
          <div className="campaign-mobile-product-glow" aria-hidden="true" />
          <img
            src={campaign.heroMobileImage}
            alt={campaign.heroMediaAlt}
            className="relative z-10 h-full w-full object-contain"
            loading="eager"
            style={{ objectFit: campaign.heroImageFit, objectPosition: campaign.heroImagePosition }}
          />
        </motion.div>

        {campaign.showPriceCard && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="rounded-[1.5rem] border border-white/14 bg-white/12 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-100">Combo Offer</p>
                <h2 className="mt-1 text-xl font-black text-white">{campaign.featuredComboName}</h2>
              </div>
              {campaign.showRating && (
                <div className="flex items-center rounded-full bg-white/12 px-2.5 py-1 text-amber-100">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="h-3 w-3 fill-current" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-white">{campaign.featuredComboPrice}</span>
              {campaign.showOriginalPrice && (
                <span className="pb-1 text-sm font-semibold text-white/45 line-through">
                  {campaign.featuredComboOriginalPrice}
                </span>
              )}
            </div>

            {campaign.showSavings && (
              <p className="mt-1 text-sm font-bold text-emerald-200">{campaign.featuredComboSavings}</p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="flex flex-col gap-3"
        >
          <button
            type="button"
            onClick={() => window.location.href = campaign.primaryCTA.href}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black text-gray-950 shadow-xl transition-all duration-300 active:scale-[0.98]"
          >
            {campaign.primaryCTA.label}
            <ArrowRight className="h-4 w-4" />
          </button>
          {campaign.showSecondaryCTA && (
            <button
              type="button"
              onClick={() => window.location.href = campaign.secondaryCTA.href}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl border border-white/18 bg-white/10 px-6 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 active:scale-[0.98]"
            >
              {campaign.secondaryCTA.label}
            </button>
          )}
        </motion.div>

        {campaign.showCountdown && campaign.countdownEnabled && <CampaignCountdown countdown={countdown} variant="mobile" />}

        {campaign.showTrustStrip && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {campaign.trustPoints.map((point) => (
              <span
                key={point}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/86 shadow-sm backdrop-blur-md"
              >
                <Check className="h-3.5 w-3.5 text-emerald-200" />
                {point}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroMobile;
