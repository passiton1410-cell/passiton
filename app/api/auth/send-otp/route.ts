import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Otp } from '@/models/Otp';
import { User } from '@/models/User';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, mode = "signup", username } = await req.json();

    if (mode === "signup") {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'User already registered. Please log in.', userExists: true },
          { status: 400 }
        );
      }
      if (username) {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          return NextResponse.json(
            { error: 'Username already taken. Please choose another one.', usernameExists: true },
            { status: 400 }
          );
        }
      }
    } else if (mode === "reset") {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return NextResponse.json(
          { error: 'User not found.' },
          { status: 400 }
        );
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    const MSG91_API = 'https://control.msg91.com/api/v5/email/send';

    const {
      MSG91_AUTHKEY,
      MSG91_TEMPLATE_ID,
      MSG91_FROM_EMAIL,
      MSG91_DOMAIN,
      MSG91_VARIABLE_OTP,
      MSG91_VARIABLE_COMPANY_NAME,
      MSG91_COMPANY_NAME,
    } = process.env;

    if (
      !MSG91_AUTHKEY ||
      !MSG91_TEMPLATE_ID ||
      !MSG91_FROM_EMAIL ||
      !MSG91_DOMAIN ||
      !MSG91_VARIABLE_OTP ||
      !MSG91_VARIABLE_COMPANY_NAME ||
      !MSG91_COMPANY_NAME
    ) {
      console.error('Missing MSG91 configuration in .env');
      console.error({
        MSG91_AUTHKEY: !!MSG91_AUTHKEY,
        MSG91_TEMPLATE_ID: !!MSG91_TEMPLATE_ID,
        MSG91_FROM_EMAIL: !!MSG91_FROM_EMAIL,
        MSG91_DOMAIN: !!MSG91_DOMAIN,
        MSG91_VARIABLE_OTP: !!MSG91_VARIABLE_OTP,
        MSG91_VARIABLE_COMPANY_NAME: !!MSG91_VARIABLE_COMPANY_NAME,
        MSG91_COMPANY_NAME: !!MSG91_COMPANY_NAME,
      });
      return NextResponse.json({ error: 'Missing MSG91 config' }, { status: 500 });
    }

    const body = {
      recipients: [
        {
          to: [{ email }],
          variables: {
            [MSG91_VARIABLE_OTP!]: otp,
            [MSG91_VARIABLE_COMPANY_NAME!]: MSG91_COMPANY_NAME!,
          },
        },
      ],
      from: { email: MSG91_FROM_EMAIL },
      domain: MSG91_DOMAIN,
      template_id: MSG91_TEMPLATE_ID,
    };

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authkey: MSG91_AUTHKEY!,
    };

    console.log('Sending MSG91 email:', JSON.stringify(body, null, 2));

    // TEMPORARY: For testing, log OTP to console
    console.log('🔑 DEVELOPMENT OTP FOR TESTING:', otp);
    console.log('📧 Send this OTP to:', email);

    const msgRes = await fetch(MSG91_API, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const msgJson = await msgRes.json();

    console.log('MSG91 response status:', msgRes.status);
    console.log('MSG91 response:', msgJson);

    if (!msgRes.ok || msgJson.hasError) {
      console.error('MSG91 Error:', msgJson);
      return NextResponse.json({
        error: 'Failed to send OTP',
        details: msgJson.message || 'MSG91 API error'
      }, { status: 500 });
    }

    // Additional check for MSG91 success
    if (msgJson.status === 'fail') {
      console.error('MSG91 returned fail status:', msgJson);
      return NextResponse.json({
        error: 'Failed to send OTP',
        details: msgJson.message || 'MSG91 returned fail status'
      }, { status: 500 });
    }

    console.log('OTP sent successfully via MSG91');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
