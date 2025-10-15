// app/terms/page.tsx
"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <section className="w-full bg-[#fff9e8] mx-auto px-4 sm:px-6 pt-12 pb-16">
      <div className="bg-[#fff9e8] text-[#23185B] p-6 sm:p-10 rounded-2xl shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center">PassitOn: Comprehensive Terms and Conditions for Student Marketplace</h1>

        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">

          <div>
            <p className="font-bold text-base mb-3">1. Definitions and General Scope</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Platform:</strong> PassitOn is an online marketplace connecting verified students for buying, selling, and exchanging goods and services within educational campuses.</li>
              <li><strong>Users:</strong> Includes both buyers and sellers, who must be currently affiliated with a recognized institution.</li>
              <li><strong>Agreement:</strong> By registering, accessing, or interacting with PassitOn, users consent to all terms, privacy, and policies outlined below. These terms may be updated at any time; continued use implies acceptance of updates.</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">2. User Eligibility, Registration & Account Security</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Eligibility:</strong> Users must be students of recognised and registered educational institutions. Proof may be required during signup/registration or at any time.</li>
              <li>Users must be 18 years or older. Students below 18 require guardian consent.</li>
              <li><strong>Registration:</strong> Accurate personal information, including valid institutional email and, where required, student ID must be provided.</li>
              <li><strong>Account Responsibility:</strong> Users are responsible for safeguarding their credentials. Any misuse, unauthorized access, or suspicious activity must be reported immediately to PassitOn.</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">3. User Conduct, Content, and Prohibited Activities</p>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400 mb-4">
              <p className="font-bold text-red-800 mb-2">List of Prohibited and Banned Items (As per Indian Laws and Campus Guidelines)</p>
              <p className="text-red-700 text-sm">Users must NOT list, trade, or promote any of the following items or services on PassitOn. Any such listing will be removed immediately and may result in account suspension or termination:</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-semibold text-red-600">• Illegal/Narcotic Substances:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Drugs (e.g., narcotics, psychotropic substances, cannabis, heroin, cocaine) as legally banned/prescribed in schedules under government regulation</li>
                  <li>Illegal alcohol or substances banned in the jurisdiction</li>
                  <li>Alcohol and Alcoholic beverages</li>
                  <li>Tobacco and related products</li>
                  <li>Electronic cigarettes (e-cigarettes), vapes and vaporizers, e-hookahs</li>
                  <li>Heat-not-burn (HNB) products and Electronic Nicotine Delivery Systems (ENDS)</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-red-600">• Weapons and Explosives:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Firearms, ammunition, explosives, fireworks, and bomb-making material</li>
                  <li>Knives, blades, or other sharp tools or weapons</li>
                  <li>Firecrackers and any kind of explosives or raw material used in celebration or festivals</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-red-600">• Stolen or Fraudulent Goods:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Items suspected or proven to be stolen property or counterfeit</li>
                  <li>Fake ID cards, student IDs, admission letters, or certificates</li>
                  <li>Forged academic transcripts or mark sheets</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-red-600">• Hazardous and Restricted Chemicals:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Toxic, radioactive, or poisonous materials</li>
                  <li>Hazardous chemicals regulated under the Environment (Protection) Act, 1986</li>
                  <li>Hazardous materials, explosives, fireworks, flammable chemicals, toxic substances</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-red-600">• Pornographic, Obscene, or Offensive Material:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Explicit adult content, pornography, or sexually explicit goods</li>
                  <li>Hate speech, defamatory materials, or anything offensive or abusive</li>
                  <li>Sex toys, personal massagers, adult goods and services</li>
                  <li>Content platforms or OTT apps that distribute obscene or pornographic content</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-red-600">• Prohibited Medicines and Medical Items:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Antibiotics, antivirals, or antifungals without a valid prescription</li>
                  <li>Controlled substances (e.g., opioids, sedatives, psychotropic drugs)</li>
                  <li>Surgical instruments, medical equipment without certification</li>
                  <li>Any medical items violating Drugs and Cosmetics Act, 1940 or Indian Medical Device Rules 2017</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-red-600">• Political and Religious Activities:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Political campaigning, organizing rallies, or political fundraising</li>
                  <li>Religious preaching, organizing religious gatherings</li>
                  <li>Any discriminatory conduct based on religion, caste, gender, or ethnicity</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-red-600">• Animals, Wildlife, and Food Items:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Living and non-living animals banned under wildlife protection laws</li>
                  <li>Food items: raw, cooked or processed banned by FSSAI</li>
                  <li>Contaminated spices and herbal products</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mt-4">
              <p className="font-bold text-yellow-800">General Conduct:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1 text-yellow-700">
                <li>Users must act lawfully, ethically, and respectfully in all activities</li>
                <li>All communication must remain within in-app messaging unless explicitly permitted</li>
              </ul>
            </div>
          </div>

          <div>
            <p className="font-bold text-base mb-3">4. Listing Rules and Product Requirements</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Accuracy:</strong> Item listings must provide complete and truthful information, including price, quality, quantity, photos, and disclosures of defects, expiry dates, warranty, etc.</li>
              <li><strong>Updates:</strong> Sellers are responsible for promptly updating or removing sold or unavailable listings</li>
              <li><strong>Fair Practice:</strong> Listings that misrepresent, exaggerate, or conceal material facts are prohibited</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">5. Platform Fees, Payments, and Promotions</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Basic Usage:</strong> PassitOn does not charge fees for standard listing or buying. Special features (e.g., featured listings) may incur non-refundable promotional charges</li>
              <li><strong>Transaction Handling:</strong> The platform does not process payments or provide escrow. Transactions are strictly between buyer and seller</li>
              <li><strong>Promotions:</strong> Fee-based promotional services are valid only within defined parameters and duration. All such fees are non-refundable</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">6. Shipping, Delivery, and Fulfilment</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>No Delivery by PassitOn:</strong> PassitOn does not provide any delivery, courier, shipping, logistic, or handling services</li>
              <li><strong>User Responsibility:</strong> All arrangements for exchange, delivery, or pick-up are solely between buyer and seller</li>
              <li><strong>Campus Exchanges Recommended:</strong> Users are encouraged to limit transactions to secure, campus-approved locations</li>
              <li><strong>Risk Acknowledgment:</strong> PassitOn shall not be liable for any loss, damage, delay, or dispute arising from delivery or transfer of goods</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">7. Returns, Refunds, Cancellations</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Direct Negotiation:</strong> Returns and refunds must be settled directly between users</li>
              <li><strong>Written Agreements:</strong> Users are advised to document agreements in in-app chat</li>
              <li><strong>Irreversible Payments:</strong> All payments made for featured listings or promotional tools are final and non-refundable</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">8. Dispute Resolution and Grievance Redressal</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Reporting:</strong> Issues must be reported within 7 days via email to the Grievance Officer (hi@passiton.cash)</li>
              <li><strong>Resolution Process:</strong> PassitOn may assist informally but is not an arbitrator. Platform decisions on moderation are final</li>
              <li><strong>Legal Recourse:</strong> Users may seek legal or institutional remedies as appropriate</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">9. Fraud and User Safety Measures</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Verification:</strong> Only verified student accounts can participate</li>
              <li><strong>Warnings:</strong> PassitOn publishes and continually updates fraud avoidance guidelines</li>
              <li><strong>Suspension:</strong> Accounts engaged in suspicious, illegal, or abusive activity may be suspended without notice</li>
              <li><strong>No Guarantee:</strong> Despite safeguards, PassitOn does not guarantee truthfulness of listings or reliability of users</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">10. Privacy Policy and Data Use</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Data Collected:</strong> Minimal data required for operation—name, verified email, institution, listing information, basic contact details</li>
              <li><strong>Data Use:</strong> Data is used to facilitate secure operations and communication. Never sold to third-parties</li>
              <li><strong>Data Protection:</strong> Standard measures, including encryption and regular security audits, are employed</li>
              <li><strong>Legal Compliance:</strong> Information may be shared with authorities as required by law</li>
              <li><strong>User Rights:</strong> Users can request correction, access, or deletion of data by contacting support</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">11. Intellectual Property Rights</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Ownership:</strong> Users retain rights over content they submit but grant PassitOn license to display and distribute listings</li>
              <li><strong>Copyright Claims:</strong> Alleged infringement will result in removal upon proper notification</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">12. Liability, Limitation, and Indemnity</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>No Guarantees:</strong> PassitOn is a facilitator only and does not ensure completion or satisfaction of any transaction</li>
              <li><strong>Limitation of Liability:</strong> PassitOn's total liability is limited to the extent permitted by law</li>
              <li><strong>Indemnity:</strong> Users agree to indemnify and hold PassitOn harmless for any losses, damages, or claims arising from their misuse</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">13. Modification and Termination</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Policy Updates:</strong> These terms may be revised without prior notice. Continued use constitutes acceptance</li>
              <li><strong>Account Termination:</strong> Platform may terminate accounts due to breach, non-activity, abuse, or at account holder's request</li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-base mb-3">14. Governing Laws and Jurisdiction</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>This agreement is governed by the applicable laws of India</li>
              <li>Any unresolved disputes are subject to the jurisdiction of the courts where PassitOn's head office is located</li>
            </ul>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
            <p className="font-bold text-lg text-red-800 mb-3">Final Disclaimer and User Reminder</p>
            <p className="text-red-700 leading-relaxed">
              PassitOn is not a party to any user transaction and accepts no responsibility for fraud, misinformation, loss, damage, or disputes.
              Users transact <strong>AT THEIR OWN RISK</strong> and are required to observe all safety precautions, legal guidelines, and institutional policies.
              Any violation can lead to account suspension or permanent ban.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
            <p className="font-bold text-lg text-blue-800 mb-3">User Acknowledgment</p>
            <p className="text-blue-700 leading-relaxed">
              By using PassitOn, all users expressly agree to abide by this list of prohibited items and understand that any violation will lead to immediate action,
              including removal of listings, suspension, and reporting to relevant authorities if applicable.
            </p>
            <p className="text-blue-700 leading-relaxed mt-3">
              PassitOn reiterates that it operates strictly as a peer-to-peer platform and disavows responsibility for transactions involving prohibited items or any illegal activities.
            </p>
          </div>

          <div className="text-center bg-[#faf7ed] p-6 rounded-lg">
            <p className="font-bold text-lg mb-2">Questions? Contact us at <span className="text-[#D93D04]">hi@passiton.cash</span></p>
            <p className="text-sm text-gray-600">
              By using PassitOn, you affirm your thorough understanding and agreement with these terms and conditions.
            </p>
          </div>

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