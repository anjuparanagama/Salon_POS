import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Gift,
  HelpCircle,
  Loader2,
  Share2,
  Sparkles,
  Users,
  Calendar,
  Award,
} from "lucide-react";
import { referralService } from "../../../../services/referral.service";
import type { ReferralSummary } from "../../../../interface/referral.types";

export function ReferralSettingsView() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ReferralSummary | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await referralService.getReferralSummary();
      setSummary(data);
    } catch {
      // Fallback local mock state if offline
      setSummary({
        referral_code: "SALON-VIP2026",
        referral_link: `${window.location.origin}/register?ref=SALON-VIP2026`,
        total_referrals: 0,
        successful_referrals: 0,
        free_months_earned: 0,
        reward_balance: "0 Months Free",
        referred_by_salon_name: null,
        recent_referrals: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!summary?.referral_code) return;
    try {
      await navigator.clipboard.writeText(summary.referral_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyLink = async () => {
    const link = summary?.referral_link || `${window.location.origin}/register?ref=${summary?.referral_code || ""}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShareWhatsApp = () => {
    if (!summary?.referral_code) return;
    const link = summary.referral_link || `${window.location.origin}/register?ref=${summary.referral_code}`;
    const text = encodeURIComponent(
      `Hey! I'm using Salora POS for salon appointments, billing & inventory. Join with my referral code ${summary.referral_code} and get 1 Month Free: ${link}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-slate-500">Loading referral program...</span>
      </div>
    );
  }

  const referralCode = summary?.referral_code || "SRI-REFER";
  const shareLink = summary?.referral_link || `${window.location.origin}/register?ref=${referralCode}`;

  return (
    <div className="space-y-6">
      {/* Top Banner: Referral Program Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-primary-deep via-primary to-primary-light p-6 text-white shadow-md">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="size-3.5" />
            <span>Salon Partner Program</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Refer a Salon & Earn Free Months
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-white/90 leading-relaxed">
            Invite fellow salon owners and beauty clinics to join Salora POS. For every salon that signs up using your referral code, you both earn 1 Month Free Subscription!
          </p>
        </div>
      </div>

      {/* Referral Code & Action Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Unique Referral Code
            </span>
            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-primary/20 bg-primary-subtle px-4 py-2 font-mono text-2xl font-black text-primary-deep tracking-widest">
                {referralCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="size-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-4 text-slate-500" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Share this code for new users to enter during registration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="size-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="size-4 text-slate-500" />
                  <span>Copy Invite Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 rounded-xl bg-whatsapp px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-90 transition cursor-pointer"
            >
              <span>Invite via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Shareable Link Box */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            Direct Shareable URL
          </label>
          <div className="flex items-center justify-between gap-2 overflow-hidden text-xs text-slate-700 font-mono">
            <span className="truncate">{shareLink}</span>
          </div>
        </div>
      </div>

      {/* Referral Statistics Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Referrals</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-900">{summary?.total_referrals ?? 0}</p>
          <p className="mt-1 text-[11px] text-slate-400">Salons registered with your code</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Successful Activations</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Award className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-emerald-600">{summary?.successful_referrals ?? 0}</p>
          <p className="mt-1 text-[11px] text-slate-400">Completed registrations</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rewards Earned</span>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary-lighter text-primary">
              <Gift className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-primary">{summary?.free_months_earned ?? 0} Months</p>
          <p className="mt-1 text-[11px] text-slate-400">Free SaaS subscription accrued</p>
        </div>
      </div>

      {/* Referred Salons Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-base font-bold text-slate-900">Referred Salons History</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            List of salons that registered using your referral code.
          </p>
        </div>

        {summary && summary.recent_referrals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Salon Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Joined Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.recent_referrals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {item.referee_salon_name}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {item.referee_email || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-500 flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-slate-400" />
                      <span>{item.joined_date || "Recent"}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                        <Check className="size-3" />
                        Completed
                      </span>
                    </td>
                    <td className="px-5 py-3 text-primary font-semibold">
                      {item.reward_description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
              <Users className="size-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Referrals Yet</h4>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Share your referral code with friends and business partners in the salon industry to start earning free months!
            </p>
          </div>
        )}
      </div>

      {/* How It Works Guide */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="size-4 text-primary" />
          <h4 className="text-sm font-bold text-slate-900">How the Referral Program Works</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="rounded-xl bg-white p-4 border border-slate-200/60">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary-lighter text-primary font-bold text-xs mb-2">
              1
            </span>
            <p className="font-semibold text-slate-900 mb-1">Share Your Code</p>
            <p className="text-slate-500">
              Send your referral code or direct invite link to colleagues, fellow salon owners, or stylists.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 border border-slate-200/60">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary-lighter text-primary font-bold text-xs mb-2">
              2
            </span>
            <p className="font-semibold text-slate-900 mb-1">They Register</p>
            <p className="text-slate-500">
              When they sign up for Salora POS, they enter your referral code in the registration step.
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 border border-slate-200/60">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary-lighter text-primary font-bold text-xs mb-2">
              3
            </span>
            <p className="font-semibold text-slate-900 mb-1">Both Get Rewarded</p>
            <p className="text-slate-500">
              Both your salon and the newly registered salon automatically receive 1 Month Free Subscription!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferralSettingsView;
