import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
<<<<<<< HEAD
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
    title: "Autogaard | Nigeria's Smartest Car Marketplace",
    description: "AI-powered vehicle valuations and real-time auctions.",
};

=======
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "AutoConcierge | Nigeria's Smartest Car Marketplace",
    description: "AI-powered vehicle valuations and real-time auctions.",
};

import { ToastProvider } from "@/context/ToastContext";

>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
<<<<<<< HEAD
            <body className="antialiased">
                <ToastProvider>
                    <AuthProvider>
                        {children}
=======
            <body>
                <ToastProvider>
                    <AuthProvider>
                        <Navbar />
                        <div className="pt-16">
                            {children}
                        </div>
>>>>>>> fa1aab56098cf80f671cab12a8f3994cad407b28
                    </AuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
