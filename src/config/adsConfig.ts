// Google AdSense Configuration
// You can set these in your .env or .env.local file:
// VITE_GOOGLE_ADSENSE_CLIENT="ca-pub-XXXXXXXXXXXXXXXX"
// VITE_GOOGLE_ADSENSE_SLOT_LEFT="1234567890"
// VITE_GOOGLE_ADSENSE_SLOT_RIGHT="0987654321"

export const ADS_CONFIG = {
  // Replace with your Google AdSense Publisher ID (e.g., 'ca-pub-1234567890123456')
  // or set VITE_GOOGLE_ADSENSE_CLIENT in your .env file
  client: import.meta.VITE_GOOGLE_ADSENSE_CLIENT || 'ca-pub-4134924069967862',

  // Ad Slot ID for Left Side Ad Unit
  slotLeft: import.meta.env.VITE_GOOGLE_ADSENSE_SLOT_LEFT || '7413162483',

  // Ad Slot ID for Right Side Ad Unit
  slotRight: import.meta.env.VITE_GOOGLE_ADSENSE_SLOT_RIGHT || '6817256957',

  // Set to true to force test mode or enable visual dev placeholders
  testMode: import.meta.env.DEV || !import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT,
};
