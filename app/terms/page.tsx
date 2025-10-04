// app/terms/page.tsx
"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <section className="w-full bg-[#fff9e8] mx-auto px-4 sm:px-6 pt-12 pb-16">
      <div className="bg-[#fff9e8] text-[#23185B] p-6 sm:p-10 rounded-2xl shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-6">Terms & Conditions</h1>
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
          <p><strong>1. Definitions and General Scope</strong></p>
          <ul className="list-disc ml-6">
            <li><strong>Platform:</strong> PassitOn is an online marketplace connecting verified students for buying, selling, and exchanging goods and services within educational campuses.</li>
            <li><strong>Users:</strong> Includes both buyers and sellers, who must be currently affiliated with a recognized institution.</li>
            <li><strong>Agreement:</strong> By registering, accessing, or interacting with PassitOn, users consent to all terms, privacy, and policies outlined below.</li>
          </ul>

          <p><strong>2. User Eligibility, Registration & Account Security</strong></p>
          <ul className="list-disc ml-6">
            <li>Users must be students or staff of registered educational institutions. Proof may be required.</li>
            <li>Accurate personal information must be provided at sign-up.</li>
            <li>Users are responsible for safeguarding their login credentials.</li>
          </ul>

          <p><strong>3. Prohibited Items and Conduct</strong></p>
          <p>Users must not list or promote the following:</p>
          <ul className="list-disc ml-6">
            <li>Illegal substances, weapons, or stolen goods</li>
            <li>Pornographic or offensive material</li>
            <li>Counterfeit or pirated products</li>
            <li>Animals, human body parts, or financial instruments</li>
            <li>Any items banned under Indian or institutional law</li>
          </ul>

          <p><strong>4. Listing Rules</strong></p>
          <ul className="list-disc ml-6">
            <li>Listings must include accurate descriptions and photos</li>
            <li>Sold items must be removed promptly</li>
          </ul>

          <p><strong>5. Fees and Promotions</strong></p>
          <ul className="list-disc ml-6">
            <li>Basic listings are free</li>
            <li>Optional promotional tools may carry fees</li>
            <li>Payments are not processed by the platform</li>
          </ul>

          <p><strong>6. Shipping and Fulfillment</strong></p>
          <ul className="list-disc ml-6">
            <li>PassitOn does not provide delivery or logistics</li>
            <li>All exchanges are user-arranged</li>
            <li>Campus handoffs are strongly recommended</li>
          </ul>

          <p><strong>7. Returns and Refunds</strong></p>
          <ul className="list-disc ml-6">
            <li>Users must resolve returns directly with each other</li>
            <li>All promotional purchases are final</li>
          </ul>

          <p><strong>8. Dispute Resolution</strong></p>
          <ul className="list-disc ml-6">
            <li>Report issues to hi@passiton.cash</li>
            <li>PassitOn may moderate but does not arbitrate</li>
          </ul>

          <p><strong>9. Fraud and Safety</strong></p>
          <ul className="list-disc ml-6">
            <li>Only verified users may list or purchase</li>
            <li>PassitOn issues safety tips and may suspend violators</li>
          </ul>

          <p><strong>10. Privacy</strong></p>
          <ul className="list-disc ml-6">
            <li>We collect minimal data needed for operations</li>
            <li>Data is not sold or shared without consent unless required by law</li>
          </ul>

          <p><strong>11. Intellectual Property</strong></p>
          <ul className="list-disc ml-6">
            <li>Users retain rights to content but grant PassitOn a display license</li>
          </ul>

          <p><strong>12. Limitation of Liability</strong></p>
          <ul className="list-disc ml-6">
            <li>PassitOn is a facilitator, not a guarantor of any transaction</li>
            <li>We are not liable for disputes or losses from user transactions</li>
          </ul>

          <p><strong>13. Termination</strong></p>
          <ul className="list-disc ml-6">
            <li>Accounts may be terminated for abuse, inactivity, or at user request</li>
          </ul>

          <p><strong>14. Governing Law</strong></p>
          <ul className="list-disc ml-6">
            <li>These terms are governed by Indian law</li>
          </ul>

          <p><strong>Final Disclaimer</strong></p>
          <p>PassitOn is not responsible for fraud, disputes, or the outcome of any user transaction. By using the platform, users acknowledge these terms and transact at their own risk.</p>

          <p>Questions? Contact us at <span className="text-[#D93D04]">hi@passiton.cash</span></p>
        </div>

        <div className="mt-8 text-sm text-center text-[#23185B]">
          <p>
            Want to go back?{' '}
            <Link href="/" className="underline text-[#D93D04] hover:text-[#b62e00]">
              Return to Homepage
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}