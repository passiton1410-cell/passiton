
import emailjs from '@emailjs/browser';

export async function sendOtpEmail(email: string, otp: string) {
  return emailjs.send(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
    { to_email: email, otp },
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
  );
}
