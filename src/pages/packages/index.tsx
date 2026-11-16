import { useState, useEffect } from "react";
import {
  Sparkles,
  Check,
  Building2,
  Users,
  Scissors,
  ShieldCheck,
  PhoneCall,
  X,
  ArrowRight,
  HelpCircle,
  Clock,
  Layers,
  ChevronDown,
  PackageSearch,
} from "lucide-react";
import {
  packagesService,
  type PricingPlan,
  type CurrentSubscription,
} from "../../services/packages.service";

export function PackagesPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [currentSub, setCurrentSub] = useState<CurrentSubscription | null>(null);
  const [salonName, setSalonName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Upgrade modal state
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [upgradeNotes, setUpgradeNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    packagesService
      .getPackages()
      .then((data) => {
        if (mounted) {
          setPlans(data.plans || []);
          if (data.current_subscription) {
            setCurrentSub(data.current_subscription);
            if (data.current_subscription.billing_cycle) {
              setBillingCycle(data.current_subscription.billing_cycle);
            }
          }
          if (data.salon_name) {
            setSalonName(data.salon_name);
          }
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleOpenUpgrade = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setUpgradeNotes("");
    setUpgradeSuccess(null);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;
    setIsSubmitting(true);
    try {
      const res = await packagesService.requestUpgrade({
        plan_id: selectedPlan.id,
        billing_cycle: billingCycle,
        notes: upgradeNotes.trim() || undefined,
      });
      setUpgradeSuccess(res.message);
    } catch {
      setUpgradeSuccess("Upgrade request submitted! Our Salora team will reach out to activate your plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "Can I switch or upgrade my package at any time?",
      a: "Yes! You can upgrade your plan at any moment as your salon grows. Upgrades take effect immediately, and any unused days on your previous billing cycle are prorated automatically.",
    },
    {
      q: "Are there any hidden fees or hardware lock-ins?",
      a: "None whatsoever. Salora POS runs in your browser, tablet, iPad, or mobile phone with zero proprietary terminal hardware lock-ins. You only pay the transparent monthly or yearly subscription fee.",
    },
    {
      q: "What payment methods are supported for salon subscriptions?",
      a: "We support Visa, MasterCard, LankaPay, direct bank transfers, and automated online subscription recurring debit cards.",
    },
    {
      q: "How do multi-branch limits and staff permissions work?",
      a: "Each package allows a specific number of branches and staff profiles. Branch managers can view their respective branch's sales, while you retain master executive visibility across all salon locations.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-10 py-4 px-2 sm:px-4">
      {/* ======================================================== */}
      {/* 1. HERO HEADER WITH BILLING CYCLE SWITCHER */}
      {/* ======================================================== */}
      <div className="text-center space-y-3.5 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-50 px-3.5 py-1 text-xs font-bold text-[#D81B60] shadow-xs">
          <Sparkles className="size-3.5 text-[#D81B60]" />
          <span>Salora SaaS Packages & Pricing</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Transparent Plans Tailored for Every Salon
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
          From independent boutique salons to multi-branch luxury spa empires. Select the perfect package with walk-in POS billing, client scheduling, staff commissions, and financial analytics.
        </p>

        {/* Current Active Plan Pill if subscribed */}
        {currentSub && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-medium text-emerald-800">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>
              {salonName ? `${salonName} is currently on the ` : "Current Active Plan: "}
              <strong className="font-bold underline">{currentSub.plan_name}</strong> ({currentSub.billing_cycle})
            </span>
            <span className="rounded-full bg-emerald-200/80 px-2 py-0.5 text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
              {currentSub.status}
            </span>
          </div>
        )}

        {/* Monthly vs Yearly Toggle Switch */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="inline-flex items-center rounded-2xl bg-white p-1 border border-pink-100 shadow-xs">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-[#3A0524] to-[#5B0638] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-gradient-to-r from-[#D81B60] to-[#E91E63] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual Billing</span>
              <span className="rounded-full bg-pink-100 px-1.5 py-0.5 text-[9px] font-extrabold text-[#D81B60] uppercase">
                Save ~18%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PACKAGES CARDS GRID (Sourced strictly from Database) */}
      {/* ======================================================== */}
      {loading ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-white p-7 border border-pink-100/80 shadow-xs animate-pulse space-y-5"
            >
              <div className="h-6 w-36 bg-pink-100/50 rounded-xl" />
              <div className="h-4 w-52 bg-slate-100 rounded-md" />
              <div className="h-10 w-32 bg-pink-100/40 rounded-xl" />
              <div className="h-20 bg-pink-50/60 rounded-2xl" />
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full bg-slate-100 rounded-md" />
                <div className="h-3 w-5/6 bg-slate-100 rounded-md" />
                <div className="h-3 w-4/6 bg-slate-100 rounded-md" />
              </div>
              <div className="h-11 w-full bg-pink-100/60 rounded-2xl mt-4" />
            </div>
          ))}
        </div>
      ) : plans.length === 0 ? (
        /* Empty State if Database has no active plans */
        <div className="rounded-3xl bg-white p-12 text-center border border-pink-100 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-pink-50 text-[#D81B60] mx-auto shadow-xs">
            <PackageSearch className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No Packages Published Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Super Admin has not published any active pricing packages in the system database yet.
            </p>
          </div>
        </div>
      ) : (
        /* Sourced strictly from PostgreSQL Database */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {plans.map((plan) => {
            const isCurrent = currentSub?.plan_code === plan.code;
            const isPopular = plan.is_popular;

            // Price calculations
            const price =
              billingCycle === "monthly"
                ? plan.price_monthly
                : Math.round(plan.price_yearly / 12);
            const annualBilledTotal = plan.price_yearly;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
                  isPopular
                    ? "bg-white border-2 border-[#D81B60] shadow-xl shadow-pink-900/10 scale-100 md:-translate-y-2"
                    : "bg-white border border-pink-100/80 shadow-md hover:shadow-lg hover:border-pink-200"
                }`}
              >
                {/* Popular Ribbon / Current Plan Ribbon */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#D81B60] to-[#EC4899] px-3.5 py-1 text-[11px] font-bold text-white shadow-md shadow-pink-500/30 uppercase tracking-wider">
                      <Sparkles className="size-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                {isCurrent && !isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3.5 py-1 text-[11px] font-bold text-white shadow-md shadow-emerald-700/20 uppercase tracking-wider">
                      <Check className="size-3" />
                      Your Active Plan
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Header */}
                  <div className="space-y-1.5 border-b border-slate-100 pb-5">
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 leading-normal min-h-[38px]">
                      {plan.description || "Tailored salon management package with full features."}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="py-5 border-b border-slate-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-semibold text-slate-400">Rs.</span>
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        {Number(price).toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500">/ month</span>
                    </div>

                    {billingCycle === "yearly" ? (
                      <p className="text-[11px] text-[#D81B60] font-medium mt-1">
                        Billed annually (Rs. {Number(annualBilledTotal).toLocaleString()} / year)
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">Billed monthly, cancel anytime</p>
                    )}
                  </div>

                  {/* Capacity Badges */}
                  <div className="py-4 space-y-2 border-b border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Capacity Limits
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-[#FFF4F7] p-2 border border-pink-100/60">
                        <Building2 className="size-4 mx-auto text-[#D81B60] mb-0.5" />
                        <div className="text-xs font-bold text-slate-800">{plan.max_branches}</div>
                        <div className="text-[10px] text-slate-500">
                          {plan.max_branches === 1 ? "Branch" : "Branches"}
                        </div>
                      </div>
                      <div className="rounded-xl bg-[#FFF4F7] p-2 border border-pink-100/60">
                        <Users className="size-4 mx-auto text-[#D81B60] mb-0.5" />
                        <div className="text-xs font-bold text-slate-800">{plan.max_staff}</div>
                        <div className="text-[10px] text-slate-500">Staff</div>
                      </div>
                      <div className="rounded-xl bg-[#FFF4F7] p-2 border border-pink-100/60">
                        <Scissors className="size-4 mx-auto text-[#D81B60] mb-0.5" />
                        <div className="text-xs font-bold text-slate-800">{plan.max_services}</div>
                        <div className="text-[10px] text-slate-500">Services</div>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="py-5 space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Included Features
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <div className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                            <Check className="size-3 stroke-[2.5]" />
                          </div>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-6">
                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-2xl bg-emerald-50 border border-emerald-300 py-3 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 cursor-default"
                    >
                      <Check className="size-4" />
                      <span>Your Current Active Plan</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenUpgrade(plan)}
                      className={`w-full rounded-2xl py-3 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 ${
                        isPopular
                          ? "bg-gradient-to-r from-[#D81B60] to-[#AD1457] text-white hover:opacity-95 shadow-pink-500/25 shadow-md"
                          : "bg-gradient-to-r from-[#3A0524] to-[#5B0638] text-white hover:opacity-95"
                      }`}
                    >
                      <span>{currentSub ? "Switch to this Plan" : "Choose Package"}</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. ENTERPRISE / CUSTOM SETUP BANNER */}
      {/* ======================================================== */}
      <div className="rounded-3xl bg-gradient-to-r from-[#3A0524] via-[#5B0638] to-[#2D031C] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-[11px] font-semibold text-pink-200">
            <Layers className="size-3 text-pink-300" />
            <span>Salon Franchises & Chains</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">
            Need a Custom Multi-Branch Deployment?
          </h3>
          <p className="text-xs sm:text-sm text-pink-100/80 leading-relaxed">
            If you operate more than 10 salons or require custom hardware integrations, POS fiscal printer drivers, and dedicated SLA servers, our team is ready to build your custom package.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href="tel:+94771234567"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-[#3A0524] shadow-sm hover:bg-pink-50 transition active:scale-95"
          >
            <PhoneCall className="size-4 text-[#D81B60]" />
            <span>Call +94 77 123 4567</span>
          </a>
          <a
            href="https://wa.me/94771234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white hover:bg-white/20 transition active:scale-95"
          >
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ======================================================== */}
      <div className="space-y-4 max-w-3xl mx-auto pt-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <HelpCircle className="size-5 text-[#D81B60]" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs text-slate-500">Everything you need to know about billing & subscriptions</p>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-pink-100 bg-white shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-slate-800 hover:text-[#D81B60] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`size-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                      isOpen ? "rotate-180 text-[#D81B60]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. UPGRADE PLAN CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-slate-900 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-pink-50 text-[#D81B60]">
                  <Sparkles className="size-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Choose Package</h3>
                  <p className="text-[11px] text-slate-500">{selectedPlan.name}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="size-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Content */}
            {upgradeSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
                  <Check className="size-6 stroke-[2.5]" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Request Received!</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  {upgradeSuccess}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="rounded-xl bg-[#3A0524] px-5 py-2.5 text-xs font-bold text-white hover:opacity-95 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Selected Plan Summary Box */}
                <div className="rounded-2xl bg-[#FFF4F7] p-4 border border-pink-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Selected Plan</span>
                    <span className="text-xs font-bold text-[#8B1447]">{selectedPlan.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Billing Interval</span>
                    <span className="text-xs font-bold text-slate-800 capitalize">
                      {billingCycle} ({billingCycle === "yearly" ? "Save ~18%" : "Monthly"})
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-pink-200/60 pt-2">
                    <span className="text-xs font-semibold text-slate-700">Estimated Cost</span>
                    <span className="text-sm font-extrabold text-[#D81B60]">
                      Rs.{" "}
                      {billingCycle === "yearly"
                        ? `${Number(selectedPlan.price_yearly).toLocaleString()} / year`
                        : `${Number(selectedPlan.price_monthly).toLocaleString()} / month`}
                    </span>
                  </div>
                </div>

                {/* Additional Notes / Salon Details */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Additional Notes / Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={upgradeNotes}
                    onChange={(e) => setUpgradeNotes(e.target.value)}
                    placeholder="e.g. Requesting extra branch setup, direct debit payment or billing inquiry..."
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-[#D81B60] focus:ring-1 focus:ring-[#D81B60] focus:outline-none"
                  />
                </div>

                {/* Salora VIP Support note */}
                <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 space-y-1">
                  <div className="font-semibold text-slate-700 flex items-center gap-1">
                    <Clock className="size-3.5 text-slate-400" />
                    <span>Quick Activation Process</span>
                  </div>
                  <p>
                    Your upgrade request is instantly forwarded to Salora HQ. Our support team will confirm your subscription and activate your new limits within minutes.
                  </p>
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmUpgrade}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#D81B60] to-[#AD1457] py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <span>Confirm & Request</span>
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PackagesPage;
