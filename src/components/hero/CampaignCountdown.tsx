import React from 'react';
import { Clock } from 'lucide-react';
import { campaign } from '../../config/campaign';

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

  return (
    <div
      className={`grid grid-cols-4 overflow-hidden border border-white/16 bg-white/10 shadow-2xl backdrop-blur-md ${
        compact ? 'rounded-2xl' : 'max-w-xl rounded-2xl'
      }`}
    >
      {countdown.isExpired ? (
        <div className="col-span-4 px-4 py-4 text-center text-sm font-bold text-white">
          Offer Ended
        </div>
      ) : (
        [
          ['Days', countdown.days],
          ['Hours', countdown.hours],
          ['Minutes', countdown.minutes],
          ['Seconds', countdown.seconds],
        ].map(([label, value]) => (
          <div key={label} className="border-r border-white/12 px-1.5 py-2 text-center last:border-r-0 sm:px-2 sm:py-3">
            <p className={`${compact ? 'text-base' : 'text-base sm:text-2xl'} font-extrabold text-white`}>
              {String(value).padStart(2, '0')}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100/76">{label}</p>
          </div>
        ))
      )}
      <div className="col-span-4 flex items-center justify-center gap-2 border-t border-white/12 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
        <Clock className="h-3.5 w-3.5" />
        {campaign.countdownTitle}
      </div>
    </div>
  );
};

export default CampaignCountdown;
