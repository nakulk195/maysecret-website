import React from 'react';
import { Clock } from 'lucide-react';
import { getCampaignCountdownTitle } from '../../config/campaign';

export type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
};

type CampaignCountdownProps = {
  countdown: CountdownState;
  variant?: 'desktop' | 'mobile';
};

const CampaignCountdown: React.FC<CampaignCountdownProps> = ({ countdown, variant = 'desktop' }) => {
  const compact = variant === 'mobile';

  const isEndingSoon = !countdown.isExpired && countdown.hours === 0 && countdown.minutes < 60;

  return (
    <div
      className={`grid grid-cols-4 overflow-hidden border border-white/16 bg-white/10 shadow-2xl backdrop-blur-md ${
        compact ? 'rounded-2xl' : 'max-w-xl rounded-2xl'
      } ${isEndingSoon ? 'animate-pulse' : ''}`}
    >
      {countdown.isExpired ? (
        <div className="col-span-4 px-4 py-4 text-center text-sm font-bold text-white">
          Campaign complete
        </div>
      ) : (
        [
          ['Days', countdown.days],
          ['Hours', countdown.hours],
          ['Minutes', countdown.minutes],
          ['Seconds', countdown.seconds],
        ].map(([label, value]) => (
          <div key={label} className="border-r border-white/12 px-1 py-2 text-center last:border-r-0 sm:px-2 sm:py-3">
            <p className={`${compact ? 'text-sm' : 'text-base sm:text-2xl'} font-extrabold text-white`}>
              {String(value).padStart(2, '0')}
            </p>
            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-amber-100 sm:text-[10px] sm:tracking-[0.16em]">{label}</p>
          </div>
        ))
      )}
      <div className="col-span-4 flex items-center justify-center gap-2 border-t border-white/12 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-amber-100 sm:text-xs sm:tracking-[0.16em]">
        <Clock className="h-3.5 w-3.5" />
        {getCampaignCountdownTitle()}
      </div>
    </div>
  );
};

export default CampaignCountdown;
