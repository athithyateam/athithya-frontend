import {
  Shield,
  Database,
  User,
  Globe,
  Lock,
  Settings,
  Mail,
  FileText,
} from "lucide-react";

interface PrivacySectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}

function PrivacySection({ icon: Icon, title, children }: PrivacySectionProps) {
  return (
    <div className="mb-10 text-left">
      <h2 className="flex items-center gap-3 text-xl font-semibold text-[#C59A2F] mb-4">
        <Icon className="text-[#C59A2F] shrink-0 w-5 h-5" />
        <span>{title}</span>
      </h2>
      <div className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm sm:text-base space-y-4">
        {children}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export default function PrivacyPage() {
  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen px-4 md:px-12 py-12 transition-colors pt-24 sm:pt-28 md:pt-32">
      <div className="max-w-[1200px] mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-100 dark:border-neutral-800 p-8 sm:p-12 transition-colors text-left">
        <div className="mb-10 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-[#C59A2F]">Privacy Policy</h1>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Last Updated: 09 September 2026
            </p>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed mt-6">
            At Athithya, we believe that your personal information deserves to be handled with care and transparency. Athithya connects people looking for meaningful travel experiences with local hosts. This Privacy Policy explains what personal information we collect, why we collect it, how we use it, and your choices when using Athithya.
          </p>
        </div>

        <PrivacySection icon={Shield} title="1. About Athithya">
          <p>
            Athithya operates an online travel experience platform where Hosts list authentic experiences and Guests can discover, compare and book those experiences. Experiences are provided by independent Hosts.
          </p>
        </PrivacySection>

        <PrivacySection icon={Database} title="2. Information We Collect">
          <p>Depending on how you interact with Athithya, we collect:</p>
          <BulletList
            items={[
              "Account Information: Name, email address, phone number, and profile details.",
              "Host Information: Listing descriptions, photos, meeting locations, pricing, and verification documents.",
              "Guest Information: Reservation details, participant count, and communications.",
              "Payment Information: Transaction references, amounts, and payment status via secure payment gateways.",
              "Device & Usage Data: IP address, browser type, device information, and interaction history.",
            ]}
          />
        </PrivacySection>

        <PrivacySection icon={User} title="3. How We Use Your Information">
          <p>We use personal information to:</p>
          <BulletList
            items={[
              "Create and maintain your account and process reservations.",
              "Enable direct communication between guests and hosts.",
              "Provide customer support and resolve inquiries.",
              "Prevent fraudulent or abusive activities and verify host identity.",
              "Send booking confirmations, essential service alerts, and updates.",
            ]}
          />
        </PrivacySection>

        <PrivacySection icon={Globe} title="4. How We Share Your Information">
          <p>
            We do not sell personal information. We only share information necessary to facilitate bookings between hosts and guests, work with trusted infrastructure providers (cloud hosting, OTP verification, payment processing), or comply with applicable legal obligations.
          </p>
        </PrivacySection>

        <PrivacySection icon={Lock} title="5. Data Security & Retention">
          <p>
            We implement administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, loss, or misuse. Information is retained only as long as necessary to provide services and fulfill legal requirements.
          </p>
        </PrivacySection>

        <PrivacySection icon={Settings} title="6. Cookie Policy">
          <p>
            Athithya uses essential cookies to remember sessions and preferences, as well as performance cookies to understand how the platform is used and improve the browsing experience. You can control cookie preferences in your browser settings.
          </p>
        </PrivacySection>

        <PrivacySection icon={Mail} title="7. Contact Us & Privacy Grievances">
          <p>If you have any questions about this Privacy Policy or wish to exercise your data rights, contact us at:</p>
          <div className="mt-2 space-y-1 font-semibold text-neutral-800 dark:text-neutral-200">
            <p>Athithya Website: athithya.in</p>
            <p>Privacy Email: teamsathithya@gmail.com</p>
          </div>
        </PrivacySection>

        <PrivacySection icon={FileText} title="8. Applicable Law">
          <p>
            This Privacy Policy is governed by and construed in accordance with the applicable laws of India.
          </p>
        </PrivacySection>
      </div>
    </div>
  );
}
