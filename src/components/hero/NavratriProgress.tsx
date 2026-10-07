import React from 'react';
import { getCampaignDay, getDailyTheme, navratriDailyThemes } from '../../config/campaign';

type NavratriProgressProps = {
  compact?: boolean;
};

const NavratriProgress: React.FC<NavratriProgressProps> = ({ compact = false }) => {
  const campaignDay = getCampaignDay();
  const dailyTheme = getDailyTheme(campaignDay);

  if (campaignDay === null) return null;

  return (
    <div
      className={`campaign-navratri-progress rounded-2xl border border-white/14 bg-white/[0.07] shadow-lg backdrop-blur-md ${
        compact ? 'px-3 py-2.5' : 'max-w-xl px-4 py-3'
      }`}
      style={{
        ['--campaign-daily-accent' as string]: dailyTheme.accent,
        ['--campaign-daily-glow' as string]: dailyTheme.glow,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">Navratri Glow Journey</p>
          <p className={`mt-0.5 font-black text-white ${compact ? 'text-sm' : 'text-base'}`}>
            Day {campaignDay} of {navratriDailyThemes.length}
          </p>
        </div>
        <span
          className="rounded-full border border-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{ borderColor: dailyTheme.accent, color: dailyTheme.accent }}
        >
          {dailyTheme.name}
        </span>
      </div>
      <div
        className="mt-2.5 grid grid-cols-10 gap-1"
        aria-label={`Day ${campaignDay} of ${navratriDailyThemes.length}`}
      >
        {navratriDailyThemes.map((theme) => {
          const isCurrentDay = theme.day === campaignDay;
          const isComplete = theme.day < campaignDay;

          return (
            <span
              key={theme.day}
              className={`h-1.5 rounded-full transition-colors ${isComplete ? 'opacity-60' : ''}`}
              style={{ backgroundColor: isCurrentDay || isComplete ? dailyTheme.accent : 'rgba(255, 255, 255, 0.18)' }}
              aria-hidden="true"
            />
          );
        })}
      </div>
    </div>
  );
};

export default NavratriProgress;
