import React, { useEffect, useRef, useState } from 'react';
import { ADS_CONFIG } from '../config/adsConfig';
import { ExternalLink, Info, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface GoogleAdProps {
  position: 'left' | 'right' | 'mobile';
  slot?: string;
  client?: string;
  format?: 'auto' | 'vertical' | 'horizontal' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({
  position,
  slot,
  client = ADS_CONFIG.client,
  format = 'vertical',
  responsive = true,
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const [adError, setAdError] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Determine actual slot ID based on position if not explicitly passed
  const activeSlot =
    slot ||
    (position === 'left'
      ? ADS_CONFIG.slotLeft
      : position === 'right'
      ? ADS_CONFIG.slotRight
      : ADS_CONFIG.slotLeft);

  const hasLiveConfig = Boolean(client && activeSlot);

  useEffect(() => {
    if (!hasLiveConfig) return;

    // Load Google AdSense Script if missing
    const scriptId = 'google-adsense-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push AdSense unit initialization
    try {
      if (adRef.current && adRef.current.children.length === 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.warn('AdSense push warning:', err);
      setAdError(true);
    }
  }, [client, activeSlot, hasLiveConfig]);

  const adDimensions =
    position === 'mobile' ? '320 × 100' : '160 × 600 / 300 × 600';

  const positionLabel =
    position === 'left'
      ? 'Left Sidebar Ad'
      : position === 'right'
      ? 'Right Sidebar Ad'
      : 'Banner Ad';

  // Render actual Google AdSense unit if live credentials exist
  if (hasLiveConfig && !adError) {
    return (
      <div className={`ad-container relative flex flex-col items-center w-full my-2 ${className}`}>
        <span className="text-[9px] font-semibold tracking-wider uppercase text-slate-500 mb-1">
          ADVERTISEMENT
        </span>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: position === 'mobile' ? '90px' : '600px' }}
          data-ad-client={client}
          data-ad-slot={activeSlot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    );
  }

  // Developer & Demo Placeholder Mode (when live Publisher ID / Slot ID is missing)
  return (
    <div
      className={`relative flex flex-col items-center justify-between p-3.5 rounded-2xl border border-dashed transition-all duration-300 backdrop-blur-md overflow-hidden group ${
        position === 'mobile'
          ? 'w-full max-w-md h-24 my-2'
          : 'w-40 xl:w-64 min-h-[500px] xl:min-h-[600px] sticky top-20'
      } bg-slate-900/60 dark:bg-slate-900/60 light:bg-white/80 border-indigo-500/30 hover:border-indigo-500/60 shadow-lg ${className}`}
    >
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />

      {/* Ad Header Badge */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200/80 z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-[10px] font-extrabold tracking-wider text-indigo-400 dark:text-indigo-400 light:text-indigo-600 uppercase">
            Google Ad
          </span>
        </div>
        <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-200 text-slate-400">
          {positionLabel}
        </span>
      </div>

      {/* Main Content Info */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-3 z-10 my-auto">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400 group-hover:scale-110 transition-transform">
          <Sparkles size={22} />
        </div>

        <h4 className="text-xs font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 mb-1">
          {positionLabel} Slot
        </h4>
        <p className="text-[11px] font-mono text-slate-400 dark:text-slate-400 light:text-slate-500 mb-3">
          {adDimensions}
        </p>

        <div className="p-2.5 rounded-xl bg-slate-950/70 dark:bg-slate-950/70 light:bg-slate-100 border border-slate-800/80 dark:border-slate-800/80 light:border-slate-300 text-left w-full">
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 mb-1">
            <Info size={12} className="shrink-0" />
            <span>Ready for Google Ads</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {client ? (
              <>
                Client: <code className="text-indigo-300">{client.slice(0, 10)}...</code>
                <br />
                Slot ID needed for {position} side.
              </>
            ) : (
              'Provide Publisher ID & Slot ID to display live ads.'
            )}
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="w-full pt-2 border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200/80 flex items-center justify-center z-10">
        <button
          type="button"
          onClick={() => setShowConfigModal(true)}
          className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300 light:text-indigo-600 light:hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors py-1 px-2 rounded-lg hover:bg-indigo-500/10"
        >
          <span>Setup Keys / IDs</span>
          <ExternalLink size={10} />
        </button>
      </div>

      {/* Ad Setup Modal Dialog */}
      {showConfigModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-pop-in"
          onClick={() => setShowConfigModal(false)}
        >
          <div
            className="w-full max-w-sm bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl p-5 shadow-2xl text-left"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-sm font-black text-slate-100 dark:text-slate-100 light:text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              Google AdSense Integration Guide
            </h3>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 mb-4 leading-relaxed">
              Google Ads sidebars are fully configured and ready! To connect your live AdSense account, simply add these variables to your <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300">.env.local</code> file or share your keys with us:
            </p>

            <div className="bg-slate-950 dark:bg-slate-950 light:bg-slate-100 p-3 rounded-xl font-mono text-[11px] text-slate-300 space-y-1.5 border border-slate-800 dark:border-slate-800 light:border-slate-300 mb-4 overflow-x-auto">
              <div>
                <span className="text-purple-400">VITE_GOOGLE_ADSENSE_CLIENT</span>=
                <span className="text-emerald-400">"ca-pub-XXXXXXXXXXXXXXXX"</span>
              </div>
              <div>
                <span className="text-purple-400">VITE_GOOGLE_ADSENSE_SLOT_LEFT</span>=
                <span className="text-emerald-400">"1234567890"</span>
              </div>
              <div>
                <span className="text-purple-400">VITE_GOOGLE_ADSENSE_SLOT_RIGHT</span>=
                <span className="text-emerald-400">"0987654321"</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
