import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

import { ComparisonProvider } from "@/context/ComparisonContext";

export const metadata: Metadata = {
    title: "Autogaard | Trusted Car Advisory",
    description: "Buy better. Maintain smarter. Drive with peace of mind. Autogaard helps you make better decisions at every stage of car ownership.",
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
                <ThemeProvider>
                    <ToastProvider>
                        <AuthProvider>
                            <NotificationProvider>
                                <ComparisonProvider>
                                    {children}
                                </ComparisonProvider>
                            </NotificationProvider>
                        </AuthProvider>
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
