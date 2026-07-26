import React from 'react';
import { campaign } from '../config/campaign';

const AnnouncementBar: React.FC = () => {
  if (!campaign.isCampaignActive || !campaign.showAnnouncementBar) {
    return null;
  }

  const repeatedAnnouncement = Array.from({ length: 4 }, () => campaign.announcementText);

  return (
    <div
      className="campaign-announcement-bar sticky top-0 z-50 h-10 w-full overflow-hidden border-b border-white/15 bg-gray-950/95 text-white shadow-sm backdrop-blur-md md:h-11"
      style={{ backgroundImage: campaign.gradientColors.announcement }}
    >
      <div className="campaign-announcement-shimmer" aria-hidden="true" />
      <div className="campaign-announcement-track flex h-full items-center whitespace-nowrap">
        {repeatedAnnouncement.map((message, index) => (
          <span
            key={`${message}-${index}`}
            className="mx-8 text-xs font-semibold uppercase tracking-[0.18em] text-white/95 md:text-sm"
          >
            {message}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
