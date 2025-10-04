import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      title: "Sign Up",
      icon: "/icons/signup.png",
      desc: "Create your account instantly with your student email.",
    },
    {
      title: "List Your Items",
      icon: "/icons/upload.png",
      desc: "Snap a photo, set your price, and make your items available in minutes. It’s as easy as posting to social media.",
    },
    {
      title: "Connect & Chat",
      icon: "/icons/network.png",
      desc: "Message with interested students securely. Arrange meetups right on or around campus.",
    },
    {
      title: "Meet & Exchange",
      icon: "/icons/handshake.png",
      desc: "Finalize your exchange safely and conveniently. Walk away with cash and a smile!",
    },
  ];

  return (
    <section className="w-full max-w-6xl px-4 sm:px-6 pt-6 pb-14 mx-auto">
      <h2 className="text-3xl font-extrabold text-[#23185B] mb-12 text-center">
        How It Works
      </h2>

      {/* Mobile UI: Visible only on small screens */}
      <div className="md:hidden flex flex-col space-y-10">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center px-2">
            <Image
              src={step.icon}
              alt={step.title}
              width={48}
              height={48}
              className="animate-bounce"
            />
            <h3 className="mt-4 text-xl font-semibold text-[#23185B]">{step.title}</h3>
            <p className="mt-2 text-sm text-[#4B3975] max-w-xs">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Desktop UI: Visible only on md and larger screens */}
      <div className="hidden md:block relative">
        {/* Vertical central timeline line */}
        <div className="absolute left-1/2 top-0 h-full w-1 bg-[#FFE158] -translate-x-1/2 z-10"></div>
        <div className="flex flex-col space-y-20">
          {steps.map((step, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`relative flex items-center w-full ${isLeft ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-center space-x-6 max-w-xl ${isLeft ? "pr-12" : "pl-12"}`}>
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={56}
                    height={56}
                    //className="animate-bounce"
                  />
                  <div className={`bg-white p-6 rounded-xl shadow-lg border border-[#ffe39a] max-w-md ${isLeft ? "text-left" : "text-right"}`}>
                    <h3 className="font-bold text-2xl text-[#23185B] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#4B3975] text-base font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
                {/* Timeline dot centered on line */}
                {/* <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#FFE158] border-4 border-white z-30"></div> */}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
