import {
  Shield,
  CheckCircle,
  Compass,
  User,
  Briefcase,
  Users,
  CreditCard,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface TermSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}

function TermSection({ icon: Icon, title, children }: TermSectionProps) {
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

export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen px-4 md:px-12 py-12 transition-colors pt-24 sm:pt-28 md:pt-32">
      <div className="max-w-[1200px] mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-md border border-neutral-100 dark:border-neutral-800 p-8 sm:p-12 transition-colors text-left">
        <div className="mb-10 border-b border-neutral-200 dark:border-neutral-800 pb-6">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-[#C59A2F]">Terms &amp; Conditions</h1>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Last Updated: 09 September 2026
            </p>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed mt-6">
            Welcome to Athithya, a travel experience platform that brings different travel experiences together in one place. From adventure and nature to wildlife, culture, spirituality, local experiences and more, Athithya makes it easier for guests to discover, compare and book experiences offered by independent local hosts. By accessing or using the platform, you agree to these Terms.
          </p>
        </div>

        <TermSection icon={Shield} title="1. PLATFORM ROLE & INTERMEDIARY DISCLAIMER">
          <p>
            Athithya is a travel experience marketplace and online intermediary that brings independent hosts and guests together. Athithya does not own, operate, manage, supervise or control the experiences listed by independent hosts unless expressly stated otherwise for a particular service.
          </p>
          <p>Hosts are independent service providers and are solely responsible for their listings, including:</p>
          <BulletList
            items={[
              "The accuracy and completeness of their listings.",
              "The quality and delivery of their services.",
              "Safety arrangements and procedures.",
              "Equipment, vehicles, facilities and other resources used by them.",
              "Required permits, licences, registrations and approvals.",
              "Compliance with applicable laws, regulations and safety requirements.",
            ]}
          />
        </TermSection>

        <TermSection icon={CheckCircle} title="2. ACCEPTANCE OF TERMS & ELIGIBILITY">
          <p>
            Users must be at least 18 years old to create an account or independently make a booking through Athithya. By using the platform, you confirm that you are legally capable of entering into agreements and that all information provided is accurate and truthful.
          </p>
        </TermSection>

        <TermSection icon={Compass} title="3. SERVICES OFFERED BY ATHITHYA">
          <p>
            Athithya provides a platform where independent hosts can list travel experiences and guests can discover, compare, and book experiences, view inclusions and requirements, and communicate regarding reservations.
          </p>
        </TermSection>

        <TermSection icon={User} title="4. USER RESPONSIBILITIES">
          <p>All users agree to:</p>
          <BulletList
            items={[
              "Provide accurate, complete and truthful information.",
              "Use the Platform lawfully and respectfully.",
              "Protect account credentials and report any unauthorised use.",
              "Not use Athithya for fraudulent, misleading, or abusive activities.",
            ]}
          />
        </TermSection>

        <TermSection icon={Briefcase} title="5. HOST RESPONSIBILITIES">
          <p>Hosts agree to maintain appropriate safety standards, deliver experiences substantially as described, obtain all necessary permits and registrations, and communicate with guests professionally.</p>
        </TermSection>

        <TermSection icon={Users} title="6. GUEST RESPONSIBILITIES">
          <p>Guests agree to review experience prerequisites, follow host guidelines and safety instructions, arrive punctually at designated meeting points, and respect local cultures and natural habitats.</p>
        </TermSection>

        <TermSection icon={CreditCard} title="7. BOOKINGS & PAYMENTS">
          <p>
            Bookings are confirmed upon successful payment processing through authorized payment gateways. Guests receive a booking confirmation accessible anytime within their profile dashboard.
          </p>
        </TermSection>

        <TermSection icon={AlertTriangle} title="8. CANCELLATION & REFUNDS">
          <p>
            Cancellations and refunds are governed by the specific cancellation policy selected for the experience. Clear policy details are displayed prior to completing payment.
          </p>
        </TermSection>

        <TermSection icon={FileText} title="9. GOVERNING LAW">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with the Platform shall be subject to the exclusive jurisdiction of the competent courts in Dehradun, Uttarakhand.
          </p>
        </TermSection>
      </div>
    </div>
  );
}
