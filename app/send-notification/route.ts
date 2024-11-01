import admin, { ServiceAccount } from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";
import { service_json } from "../../service_key"

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(service_json as ServiceAccount),
  });
}

export async function POST(request: NextRequest) {
  const { token, title, message, link } = await request.json();

  const payload: Message = {
    token,
    notification: {
      title: title,
      body: message,
    },
    webpush: link && {
      fcmOptions: {
        link,
      },
    },
  };
  console.log("PAYLOAD: ",payload)
  try {
    await admin.messaging().send(payload);

    return NextResponse.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error(error)
          
    return NextResponse.json({ success: false, error });
  }
}
