import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";

type AdminUser = {
    id: number;
    username: string;
};

// Global state for simple auth (reset on reload)
let currentUser: AdminUser | null = null;
const AUTH_KEY = "admin_auth_token";

export function useAdminAuth() {
    const [, setLocation] = useLocation();
    const [user, setUser] = useState<AdminUser | null>(() => {
        try {
            const stored = sessionStorage.getItem(AUTH_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const login = (userData: AdminUser) => {
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        setUser(userData);
        currentUser = userData;
    };

    const logout = () => {
        sessionStorage.removeItem(AUTH_KEY);
        setUser(null);
        currentUser = null;
        queryClient.clear();
        setLocation("/admin/login");
    };

    useEffect(() => {
        const stored = sessionStorage.getItem(AUTH_KEY);
        if (!stored) {
            setUser(null);
            currentUser = null;
        } else {
            try {
                const parsed = JSON.parse(stored);
                setUser(parsed);
                currentUser = parsed;
            } catch {
                sessionStorage.removeItem(AUTH_KEY);
            }
        }
    }, [setLocation]);

    return { user, login, logout, isLoading: false };
}

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAdminAuth();
    const [location, setLocation] = useLocation();

    useEffect(() => {
        if (!isLoading && !user && location !== "/admin/login") {
            setLocation("/admin/login");
        }
    }, [user, isLoading, location, setLocation]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
