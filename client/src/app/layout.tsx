import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

export const metadata: Metadata = {
    title: "Autogaard | Nigeria's Smartest Car Marketplace",
    description: "AI-powered vehicle valuations and real-time auctions.",
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <ToastProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
