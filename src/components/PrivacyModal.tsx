import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-pop-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-3xl p-6 shadow-2xl text-left max-h-[85vh] flex flex-col my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-100 dark:text-slate-100 light:text-slate-900">
                Privacy Policy
              </h3>
              <p className="text-xs text-slate-400">Mutation Daily Puzzle Game</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 leading-relaxed pr-1 font-sans">
          <section>
            <h4 className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-1 text-sm">
              1. Overview
            </h4>
            <p>
              Welcome to Mutation. We respect your privacy. Mutation is a web-based daily grid puzzle game. This Privacy Policy explains how data is collected, used, and safeguarded when you visit and interact with our website.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-1 text-sm">
              2. Local Storage Data
            </h4>
            <p>
              Mutation stores your game statistics (e.g. daily streak, completed puzzles, time, and move count) locally on your device using browser <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300 font-mono">localStorage</code>. This data never leaves your device and is used solely to maintain your game progress.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-1 text-sm">
              3. Google AdSense & Cookies
            </h4>
            <p>
              We use <strong>Google AdSense</strong> to display non-intrusive advertisements. Google uses cookies and web beacons to serve ads based on your prior visits to our website or other websites on the internet.
            </p>
            <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-400">
              <li>Google’s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet.</li>
              <li>You may opt out of personalized advertising by visiting Google’s <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">Ads Settings</a>.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-1 text-sm">
              4. Third-Party Vendors
            </h4>
            <p>
              Third-party vendors, including Google, use cookies to serve ads based on user visits. You can opt out of third-party vendor cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">aboutads.info</a>.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-1 text-sm">
              5. Contact
            </h4>
            <p>
              If you have any questions regarding this Privacy Policy, please contact the developer via the official repository.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
