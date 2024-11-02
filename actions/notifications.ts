"use server";
import webpush, { PushSubscription } from "web-push";

webpush.setVapidDetails(
  "mailto: <xirihad816@aleitar.com>",
  "BNF20Cp5Vt4ggtPBySVTa6YmMs5wJVS74DybHFO1nBMILKc2nSc_VSnnKzHHWaZmj5n1H1w5OTV01G9pExYhjr4",
  "I-w0U54LzZXL_FGX_jmHa7QRbSitFDq9qBwdxbZ4eG0"
);

let subscriptions: PushSubscription[] = [
  // Add your subscriptions here
];

export async function subscribeUser(sub: string) {
  const subJson = JSON.parse(sub);
  console.log("SUB: ", sub);

  subscriptions.push(subJson);
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })

  console.log("SUBS: ", subscriptions);

  return { success: true };
}

export async function unsubscribeUser(subscription: PushSubscription) {
  //   const newSubs = subscriptions.filter((sub) => sub !== subscription);

  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true };
}

export async function sendNotification(message: string) {
  console.log("SUBS: ", subscriptions);

  if (subscriptions.length === 0) {
    console.log("No subscription available");
  }

  try {
    const subSender = subscriptions.map((sub) => {
      webpush.sendNotification(
        sub,
        JSON.stringify({
          title: "Home Notification",
          body: message,
          icon: "/icon.png",
        })
      );
    });

    await Promise.all(subSender);

    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
