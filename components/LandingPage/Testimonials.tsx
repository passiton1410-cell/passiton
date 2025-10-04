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
        "THonestly didn’t expect it to be this easy. Listed my mobile and got a ping within minutes!",
      name: "Antra Agarwal",
      //designation: "Operations Director at CloudScale",
      src: "1.png",
    },
    {
      quote:
        "ONo drama, no delays—sold my device the same day. PassItOn’s process is actually stress-free.",
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
    },]

  return (
    <section className="w-full max-w-5xl px-4 sm:px-6 pt-2 pb-10">
      <div className="bg-white shadow px-6 py-5 flex flex-col sm:flex-row items-center gap-4 rounded-2xl">
       
        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
      </div>
    </section>
  );
}
