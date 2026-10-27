"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  IndianRupee,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { routes } from "@/config/navigation";

export default function CreateExperiencePage() {
  const { user, openAuthModal } = useAuthStore();
  const [step, setStep] = useState<number>(1);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Village Tours");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");

  if (!user) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-neutral-800 flex items-center justify-center text-[#C59A2F] mx-auto mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-2xl font-black mb-2">Host an Experience</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            You need to be signed in as a host to publish travel experiences on Athithya.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal("login", "host")}
            className="w-full py-3.5 rounded-full bg-[#C59A2F] text-white font-black text-xs uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md cursor-pointer"
          >
            Login or Register as Host
          </button>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center pt-24 pb-16 px-4 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center shadow-xl">
          <CheckCircle2 size={56} className="text-[#C59A2F] mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Experience Submitted!</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            Your offering has been submitted for review. Once verified by our team, it will be listed across Uttarakhand explorer directories.
          </p>
          <Link
            href={routes.home}
            className="inline-block px-6 py-3 rounded-full bg-[#C59A2F] text-white font-black text-xs uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Step Indicator */}
        <div className="mb-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-[#C59A2F]/15 text-[#C59A2F] text-xs font-black uppercase tracking-wider mb-2">
            Step {step} of 3
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {step === 1 && "Basic Experience Details"}
            {step === 2 && "Pricing & Itinerary"}
            {step === 3 && "Photos & Highlights"}
          </h1>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xl space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Experience Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Traditional Garhwali Cooking & Village Walk"
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:border-[#C59A2F] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:border-[#C59A2F] outline-none"
                >
                  <option value="Village Tours">Village Tours</option>
                  <option value="Cultural Walks">Cultural Walks</option>
                  <option value="Culinary & Dining">Culinary & Dining</option>
                  <option value="Treks & Nature">Treks & Nature</option>
                  <option value="Heritage Crafts">Heritage Crafts</option>
                  <option value="Spiritual Journeys">Spiritual Journeys</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Location (Town / District)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Sari Village, Rudraprayag"
                    className="w-full px-4 py-3 pl-10 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:border-[#C59A2F] outline-none"
                  />
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share what makes this experience special, who you are, and what guests will learn..."
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:border-[#C59A2F] outline-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Price per Person (₹)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="1200"
                      className="w-full px-4 py-3 pl-10 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:border-[#C59A2F] outline-none"
                    />
                    <IndianRupee
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Hours or Full Day"
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:border-[#C59A2F] outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#C59A2F]/10 border border-[#C59A2F]/30 text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-3">
                <ShieldCheck size={20} className="text-[#C59A2F] shrink-0 mt-0.5" />
                <p>
                  Athithya ensures direct fair payouts to local Himalayan hosts. You set your own prices with complete transparency.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Photos & Visuals
                </label>
                <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-3xl p-8 text-center hover:border-[#C59A2F] transition-colors cursor-pointer bg-white dark:bg-neutral-800/50">
                  <ImageIcon size={36} className="text-neutral-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Upload experience photos
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Drag and drop up to 5 high-resolution images
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-500 space-y-1">
                <p className="font-bold text-neutral-700 dark:text-neutral-300">
                  Host Guidelines:
                </p>
                <p>• Authentic local cultural and ecological integrity is required.</p>
                <p>• Safety protocols must be communicated to guests prior to treks.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-xs cursor-pointer"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="px-8 py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md cursor-pointer"
              >
                Publish Offering
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
