import FeedbackForm from "@/components/FeedbackForm";

export default function Feedback() {
  return (
    <div className="min-h-screen bg-[#faf7ed] py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-[#5B3DF6] mb-6">Feedback</h1>
      <FeedbackForm />
    </div>
  );
}