import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { LayoutDashboard, Tag, Package, Settings, LogOut, Store, Menu, Bookmark, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [location] = useLocation();
    const { logout, user } = useAdminAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).hideLuxLoader) {
            (window as any).hideLuxLoader();
        }
    }, []);

    const navigation = [
        { name: "الرئيسية", href: "/admin", icon: LayoutDashboard },
        { name: "المنتجات", href: "/admin/products", icon: Package },
        { name: "الأقسام", href: "/admin/categories", icon: Tag },
        { name: "صورة الواجهة", href: "/admin/hero-sliders", icon: ImageIcon },
        { name: "الإعدادات", href: "/admin/settings", icon: Settings },
    ];

    const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
        <>
            <div className="p-6 flex items-center justify-between md:justify-center border-b border-white/10">
                <Link href="/admin">
                    <a onClick={() => onClose && onClose()} className="flex items-center gap-3 group cursor-pointer">
                        <div className="bg-[#D4AF37] p-2 rounded-lg group-hover:scale-110 transition-transform">
                            <Store className="w-5 h-5 text-[#0B281F]" />
                        </div>
                        <span className="font-serif font-bold text-xl tracking-wide group-hover:text-[#D4AF37] transition-colors">
                            Lux Box
                        </span>
                    </a>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/admin");
                    const Icon = item.icon;
                    return (
                        <Link key={item.name} href={item.href}>
                            <a
                                onClick={() => onClose && onClose()}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl font-arabic font-medium transition-all duration-300",
                                    isActive
                                        ? "bg-[#D4AF37] text-[#0B281F] shadow-lg shadow-[#D4AF37]/20"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive ? "text-[#0B281F]" : "text-[#D4AF37]")} />
                                {item.name}
                            </a>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="px-4 py-3 flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-[#D4AF37]">
                        {user?.username?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-arabic font-medium truncate">{user?.username}</p>
                        <p className="text-xs text-white/50 font-arabic truncate">مدير النظام</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => { logout(); onClose && onClose(); }}
                    className="w-full justify-start gap-3 text-red-300 hover:text-red-400 hover:bg-red-400/10 font-arabic"
                >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                </Button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row" dir="rtl">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between bg-[#0B281F] text-white p-4 sticky top-0 z-30 shadow-md">
                <Link href="/admin">
                    <a className="flex items-center gap-3">
                        <div className="bg-[#D4AF37] p-2 rounded-lg">
                            <Store className="w-5 h-5 text-[#0B281F]" />
                        </div>
                        <span className="font-serif font-bold text-xl tracking-wide">
                            Lux Box
                        </span>
                    </a>
                </Link>
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[80vw] sm:w-[350px] p-0 bg-[#0B281F] text-white border-l-0" dir="rtl">
                        <div className="flex flex-col h-full pt-6">
                            <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-[#0B281F] text-white flex-col shadow-2xl z-20 sticky top-0 h-screen">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8 fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
