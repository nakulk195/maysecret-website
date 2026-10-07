import {
  campaign,
  getCampaignCountdownTarget,
  getCampaignDay,
  getCampaignState,
  getDailyTheme,
} from './campaign';

describe('Navratri campaign schedule', () => {
  it('automatically moves from the pre-campaign state into day one', () => {
    const beforeCampaign = new Date('2026-10-10T23:59:59+05:30');
    const firstDay = new Date('2026-10-11T12:00:00+05:30');

    expect(getCampaignState(beforeCampaign)).toBe('upcoming');
    expect(getCampaignCountdownTarget(beforeCampaign)).toBe('2026-10-11T00:00:00+05:30');
    expect(getCampaignState(firstDay)).toBe('active');
    expect(getCampaignDay(firstDay)).toBe(1);
    expect(getDailyTheme(getCampaignDay(firstDay)).name).toBe('Yellow');
  });

  it('uses the Dussehra state and final daily accent on October 20 in India', () => {
    const dussehra = new Date('2026-10-20T12:00:00+05:30');

    expect(getCampaignState(dussehra)).toBe('dussehra');
    expect(getCampaignDay(dussehra)).toBe(10);
    expect(getDailyTheme(getCampaignDay(dussehra)).name).toBe('Dussehra Gold');
    expect(getCampaignCountdownTarget(dussehra)).toBe('2026-10-20T23:59:59+05:30');
  });

  it('stops exposing an expired campaign and derives offers from existing product data', () => {
    expect(getCampaignState(new Date('2026-10-21T00:00:00+05:30'))).toBe('ended');
    expect(getCampaignCountdownTarget(new Date('2026-10-21T00:00:00+05:30'))).toBeNull();
    expect(campaign.offerPercentage).toBe(55);
    expect(campaign.featuredComboPrice).toBe('₹1,149');
    expect(campaign.featuredComboSavings).toBe('Save ₹1,349');
    expect(campaign.featuredComboDiscount).toBe(54);
  });

  it('keeps decorative backgrounds separate from the responsive product campaign media', () => {
    expect(campaign.heroDesktopBackgroundImage).not.toBe(campaign.heroDesktopImage);
    expect(campaign.heroMobileBackgroundImage).not.toBe(campaign.heroMobileImage);
    expect(campaign.heroTabletImage).toBe(campaign.heroDesktopImage);
  });
});
