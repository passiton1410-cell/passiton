"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AnimatedTestimonials } from "../ui/animated-testimonials";

export default function Testimonials() {
  const router = useRouter();
  const testimonials = [
    {
      quote:
        "Sold my old phone in just a few hours—no calls, no haggling. Super hassle-free!",
      name: "Anushka",
      //designation: "Product Manager at TechFlow",
      src: "/testimonials/anushka.jpeg",
    },
    {
      quote:
        "PassItOn helped me find a buyer the same day I listed my phone. So smooth and quick!",
      name: "Satyam Chauhan",
      //designation: "CTO at InnovateSphere",
      src: "/testimonials/satyam.jpeg",
    },
    {
      quote:
        "Honestly didn't expect it to be this easy. Listed my mobile and got a ping within minutes!",
      name: "Antra Agarwal",
      //designation: "Operations Director at CloudScale",
      src: "/testimonials/anushka.jpeg",
    },
    {
      quote:
        "No drama, no delays—sold my device the same day. PassItOn's process is actually stress-free.",
      name: "Aryan Rastogi",
      //designation: "Engineering Lead at DataPro",
      src: "/testimonials/aryan.jpeg",
    },
    {
      quote:
        "I love how clean and easy the site is. Found a trusted buyer instantly. Whole thing felt effortless.",
      name: "Tiya",
      //designation: "VP of Technology at FutureNet",
      src: "/testimonials/tiya.jpeg",
    },
    {
      quote:
        "The chat and UPI payment feature on PassItOn is smooth. I've completed five transactions without a single issue.",
      name: "Nikhil Das",
      src: "/testimonial-avatars/image1.png",
    },
    {
      quote:
        "I use PassItOn daily — once for selling, once for finding notes, and sometimes just to see what's trending!",
      name: "Isha Agarwal",
      src: "/testimonial-avatars/image2.png",
    },
    {
      quote:
        "Saved nearly ₹2,000 on used electronics from seniors. Why buy new when PassItOn exists?",
      name: "Rohit Raj",
      src: "/testimonial-avatars/image3.png",
    },
    {
      quote:
        "Listed my cycle, and a junior bought it the same day. Instant payment, zero hassle with PassItOn.",
      name: "Aditya Nair",
      src: "/testimonial-avatars/image4.png",
    },
    {
      quote:
        "OLX was too messy, but PassItOn is student-only and super clean. I even met my lab partner here!",
      name: "Simran Kaur",
      src: "/testimonial-avatars/image5.png",
    },
    {
      quote:
        "PassItOn made my hostel shifting so easy! Sold my furniture to juniors instead of throwing it away. Total win-win.",
      name: "Ritika Sharma",
      src: "/testimonial-avatars/image6.png",
    },
    {
      quote:
        "Finally, a marketplace that's only for students. No scams, no spam — just verified college people on PassItOn.",
      name: "Yusuf Khan",
      src: "/testimonial-avatars/image7.png",
    },
    {
      quote:
        "I love how PassItOn promotes reuse. Passing on my stuff actually feels good — sustainable and useful!",
      name: "Tanvi Iyer",
      src: "/testimonial-avatars/image8.png",
    },
    {
      quote:
        "I sold my old engineering books on PassItOn within a day — and bought a second-hand tablet for half the price!",
      name: "Aarav Mehta",
      src: "/testimonial-avatars/image9.jpeg",
    },
    {
      quote:
        "PassItOn is like our digital notice board — books, internships, roommates… everything in one place!",
      name: "Neha Patel",
      src: "/testimonial-avatars/image10.jpeg",
    },
    {
      quote:
        "The campus leaderboard makes it fun — I'm actually proud of being a top 'reuser' this month on PassItOn!",
      name: "Kunal Joshi",
      src: "/testimonial-avatars/image11.jpeg",
    },
    {
      quote:
        "Got my first freelance logo-design gig through PassItOn's campus jobs section. Earned ₹800 and confidence both!",
      name: "Harsh Verma",
      src: "/testimonial-avatars/image12.png",
    },
    {
      quote:
        "PassItOn helped me donate my old uniforms and books to first-years. Feels great to give back.",
      name: "Aditi Chauhan",
      src: "/testimonial-avatars/image13.png",
    },]

  return (
    <section className="w-full max-w-5xl px-4 sm:px-6 pt-2 pb-10">
      <div className="bg-white shadow px-6 py-5 flex flex-col sm:flex-row items-center gap-4 rounded-2xl">
       
        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
      </div>
    </section>
  );
}
