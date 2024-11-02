"use client";

import { sendNotification, subscribeUser } from "@/actions/notifications";
import InstallPrompt from "@/components/iosLayout";
import { Button } from "@/components/ui/button";
import useFcmToken from "@/hooks/useFcmToken";
import { useState } from "react";
import { PushSubscription } from "web-push";

export default function Home() {
  const { loadToken, token, notificationPermissionStatus } = useFcmToken();
  const [sub, setSub] = useState<PushSubscription | null>(null);

  const handleTestNotification = async () => {
    const response = await fetch("/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        title: "Test Notification",
        message: "This is a test notification",
        link: "/contact",
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register(
        "/custom-sw.js"
      );
      const sub = await registration.pushManager.getSubscription();

      if (!sub) {
        console.log("No subscription found, subscribing...");
        await subscribeToPush();
      } else {
        await subscribeUser(JSON.stringify(sub));
        console.log("Subscription found:", sub);
        // Lógica para manejar la suscripción existente
        setSub(sub as unknown as PushSubscription);
      }

      // Resto de tu lógica...
    } catch (error) {
      console.error(
        "Error registering service worker or getting subscription:",
        error
      );
    }
  }

  async function getNotificactionHomeMade() {
    if (!("Notification" in window)) {
      console.info("This browser does not support desktop notification");
      return null;
    }

    if (Notification.permission === "granted") {
      await subscribeToPush();
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await subscribeToPush();
      }
    }
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BNF20Cp5Vt4ggtPBySVTa6YmMs5wJVS74DybHFO1nBMILKc2nSc_VSnnKzHHWaZmj5n1H1w5OTV01G9pExYhjr4"
      ),
    });

    setSub(sub as unknown as PushSubscription);

    const decoder = new TextDecoder();
    const keys = await sub.getKey("p256dh");
    const auth = await sub.getKey("auth");

    // const customSub: PushSubscription = {
    //   endpoint: sub.endpoint,
    //   expirationTime: sub.expirationTime,
    //   keys: {
    //     p256dh: keys ? decoder.decode(keys) : "",
    //     auth: auth ? decoder.decode(auth) : "",
    //   },
    // };

    await subscribeUser(JSON.stringify(sub));
    console.log("Notification permission not granted.");
    return null;
  }

  async function sendTestNotification() {
    if (sub) {
      await sendNotification("message from home made");
      alert("Notification sent!");
    } else {
      console.log("No hay subscription");
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl mb-4 font-bold">Firebase Cloud Messaging Demo</h1>

      {notificationPermissionStatus === "granted" ? (
        <p>Permission to receive notifications has been granted.</p>
      ) : notificationPermissionStatus !== null ? (
        <p>
          You have not granted permission to receive notifications. Please
          enable notifications in your browser settings.
        </p>
      ) : null}

      <Button
        disabled={!token}
        className="mt-5"
        onClick={handleTestNotification}
      >
        Send Test Notification
      </Button>

      <Button className="mt-5" onClick={loadToken}>
        Request Notifications
      </Button>

      <span
        id="token_span"
        className="mt-5 boder border-white bg-slate-400 text-black rounded"
      >
        {token}
      </span>
      <Button className="mt-5" onClick={getNotificactionHomeMade}>
        Request Notifications HomeMade
      </Button>
      <Button className="mt-5" onClick={registerServiceWorker}>
        Register custom SW
      </Button>

      <Button className="mt-5" onClick={sendTestNotification}>
        Sent notifications HomeMade
      </Button>
      <span
        id="token_span"
        className="mt-5 boder border-white bg-slate-400 text-black rounded"
      >
        {JSON.stringify(sub)}
      </span>
    </main>
  );
}
