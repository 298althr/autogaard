'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ShieldCheck, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) return null;

    if (!user) {
        if (typeof window !== 'undefined') {
            router.push('/login?redirect=/admin');
        }
        return null;
    }

    if (user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-canvas p-4">
                <div className="text-center bg-white p-12 rounded-[3rem] shadow-2xl border border-red-100 max-w-md">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-3xl font-black text-onyx mb-4">Access Denied</h1>
                    <p className="text-onyx-light font-medium mb-8">Your account does not have administrator privileges. Please return to the homepage.</p>
                    <Link href="/" className="btn-primary px-8 py-3 rounded-xl inline-block">Back to Safety</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-canvas">
            <AdminSidebar />
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
