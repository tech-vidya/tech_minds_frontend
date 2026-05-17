import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

function SettingRow({ label, desc, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-slate-700/50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${value ? "bg-indigo-600" : "bg-slate-600"}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5.5" : "translate-x-0.5"}`}
        style={{ transform: value ? "translateX(22px)" : "translateX(2px)" }} />
    </button>
  );
}

export default function PlatformSettings() {
  const [settings, setSettings] = useState({
    siteName: "Tech Minds",
    siteUrl: "https://techvidya.com",
    supportEmail: "support@techvidya.com",
    platformFeePercent: 20,
    allowFreeRegistration: true,
    requireEmailVerification: true,
    allowCreatorSelfSignup: true,
    requireCreatorApproval: true,
    maintenanceMode: false,
    maxVideoSizeMB: 500,
    maxFileSizeMB: 50,
    stripeEnabled: true,
    freeCourseEnabled: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const set = (key, val) => setSettings(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API
    setIsSaving(false);
    toast.success("Settings saved ✓");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Configure site-wide settings and defaults.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2">
          {isSaving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving...</> : "Save Settings"}
        </button>
      </motion.div>

      {/* General */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">General</h2>
        <SettingRow label="Site Name" desc="Displayed in emails and browser tabs">
          <input value={settings.siteName} onChange={e => set("siteName", e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition w-48" />
        </SettingRow>
        <SettingRow label="Support Email" desc="Where users send support requests">
          <input value={settings.supportEmail} onChange={e => set("supportEmail", e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition w-48" />
        </SettingRow>
        <SettingRow label="Maintenance Mode" desc="Shows a maintenance page to all non-admin users">
          <Toggle value={settings.maintenanceMode} onChange={v => set("maintenanceMode", v)} />
        </SettingRow>
      </div>

      {/* Registration & Auth */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Registration & Auth</h2>
        <SettingRow label="Allow free registration" desc="Users can sign up without an invite">
          <Toggle value={settings.allowFreeRegistration} onChange={v => set("allowFreeRegistration", v)} />
        </SettingRow>
        <SettingRow label="Require email verification" desc="Users must verify before accessing the platform">
          <Toggle value={settings.requireEmailVerification} onChange={v => set("requireEmailVerification", v)} />
        </SettingRow>
        <SettingRow label="Allow creator self-signup" desc="Users can register directly as creators">
          <Toggle value={settings.allowCreatorSelfSignup} onChange={v => set("allowCreatorSelfSignup", v)} />
        </SettingRow>
        <SettingRow label="Require creator approval" desc="Admin must approve creator accounts before publishing">
          <Toggle value={settings.requireCreatorApproval} onChange={v => set("requireCreatorApproval", v)} />
        </SettingRow>
      </div>

      {/* Payments */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Payments</h2>
        <SettingRow label="Platform fee (%)" desc="Percentage kept by Tech Minds on each sale">
          <div className="flex items-center gap-2">
            <input type="number" value={settings.platformFeePercent} min={0} max={100}
              onChange={e => set("platformFeePercent", Number(e.target.value))}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-sm text-white w-20 text-center focus:outline-none focus:border-indigo-500 transition" />
            <span className="text-slate-400 text-sm">%</span>
          </div>
        </SettingRow>
        <SettingRow label="Stripe payments" desc="Enable paid course checkout via Stripe">
          <Toggle value={settings.stripeEnabled} onChange={v => set("stripeEnabled", v)} />
        </SettingRow>
        <SettingRow label="Free courses" desc="Allow creators to publish free courses">
          <Toggle value={settings.freeCourseEnabled} onChange={v => set("freeCourseEnabled", v)} />
        </SettingRow>
      </div>

      {/* Upload limits */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Upload Limits</h2>
        <SettingRow label="Max video size (MB)" desc="Maximum size for lesson video uploads">
          <input type="number" value={settings.maxVideoSizeMB} min={1}
            onChange={e => set("maxVideoSizeMB", Number(e.target.value))}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-sm text-white w-24 text-center focus:outline-none focus:border-indigo-500 transition" />
        </SettingRow>
        <SettingRow label="Max file size (MB)" desc="Maximum size for notes and assignment files">
          <input type="number" value={settings.maxFileSizeMB} min={1}
            onChange={e => set("maxFileSizeMB", Number(e.target.value))}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-sm text-white w-24 text-center focus:outline-none focus:border-indigo-500 transition" />
        </SettingRow>
      </div>
    </div>
  );
}
