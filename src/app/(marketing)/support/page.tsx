"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, Clock, Check, Send, ArrowRight, MessageSquare } from "lucide-react";
import { routes } from "@/config/navigation";

const SUPPORT_CONTACT = {
  whatsapp: "+91 9389860637",
  email: "teamsathithya@gmail.com",
  phone: "+91 93898 60637",
};

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pb-16 md:pb-24">
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 relative overflow-hidden text-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-neutral-800 text-xs font-bold text-[#C59A2F] border border-amber-200 uppercase tracking-wider mb-3 mx-auto">
            Help &amp; Support
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
            We&apos;re Here to <span className="text-[#C59A2F]">Help You</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base md:text-lg max-w-3xl font-medium mt-2 leading-relaxed mx-auto">
            Have questions about bookings, host verification, cancellations, or experience details? Reach out directly to our dedicated local support team for fast assistance.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Form Card (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs backdrop-blur-sm flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center justify-between gap-4 mb-5">
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-neutral-800 border border-amber-200 text-xs font-bold uppercase tracking-wider text-[#C59A2F]">
                  Priority Support Channel
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Response
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-1">
                Send Us a Message
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                Available for travellers, hosts, and experience booking queries.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3">
                    <Check size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                    Message Sent Successfully
                  </h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                    Thank you! Our support team will review your inquiry and get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-full bg-[#C59A2F] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#A67F26] transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#C59A2F] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#C59A2F] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 Mobile number"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#C59A2F] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your inquiry..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#C59A2F] text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Submit Inquiry</span>
                    <Send size={13} />
                  </button>
                </form>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-200/70 dark:border-neutral-800">
              <a
                href={`https://wa.me/${SUPPORT_CONTACT.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#25D366] text-white hover:bg-[#1fa855] transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`mailto:${SUPPORT_CONTACT.email}`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:border-[#C59A2F] transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#C59A2F]" />
                <span>Email</span>
              </a>
              <a
                href={`tel:${SUPPORT_CONTACT.phone.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:border-[#C59A2F] transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#C59A2F]" />
                <span>Call</span>
              </a>
            </div>
          </div>

          {/* Info Card (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs backdrop-blur-sm flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-neutral-800 border border-amber-200 text-[#C59A2F] flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Operational Hours
                </h4>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/70 dark:border-neutral-700/70 mb-5">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Operating Time:</p>
                <p className="text-base font-extrabold text-[#C59A2F]">
                  10:00 AM – 5:00 PM IST
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Messages received after operating hours are prioritized early next morning.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Quick Resolution Checklist:
                </p>
                <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <Check className="text-[#C59A2F] shrink-0 mt-0.5 w-4 h-4" />
                    <span>Include your <strong>Booking ID</strong> if inquiry relates to a booking.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-[#C59A2F] shrink-0 mt-0.5 w-4 h-4" />
                    <span>Provide your registered account phone number or email address.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="text-[#C59A2F] shrink-0 mt-0.5 w-4 h-4" />
                    <span>Briefly describe the experience, dates, and question or issue.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-200/70 dark:border-neutral-800">
              <Link
                href={routes.home}
                className="text-sm font-bold text-[#C59A2F] hover:underline inline-flex items-center gap-1.5"
              >
                <span>Browse frequently asked questions on Home</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
