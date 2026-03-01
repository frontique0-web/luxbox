import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Store } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const { login } = useAdminAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await apiRequest("POST", "/api/admin/login", { username, password });
            const data = await res.json();

            // The backend returns `{ success: true, username: "admin", adminId: 1 }`
            login({ id: data.adminId, username: data.username });
            toast({
                title: "تم تسجيل الدخول",
                description: "مرحباً بك في لوحة تحكم الإدارة",
            });
            setLocation("/admin");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "فشل تسجيل الدخول",
                description: error.message || "تأكد من اسم المستخدم وكلمة المرور",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B281F] flex flex-col items-center justify-center p-6 relative overflow-hidden" dir="rtl">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/assets/marble-bg.png')] opacity-10 pointer-events-none bg-cover bg-center" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0B281F]/50 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-[400px]">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4AF37]/10 mb-4 border border-[#D4AF37]/20 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                        <Store className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-[#D4AF37] mb-2 drop-shadow-sm">Lux Box</h1>
                    <p className="text-white/80 font-arabic tracking-wide text-sm">لوحة تحكم الإدارة</p>
                </div>

                <Card className="w-full border-0 shadow-2xl bg-white/95 backdrop-blur-xl rounded-[24px]">
                    <CardHeader className="space-y-2 text-center pt-8 pb-4">
                        <CardTitle className="text-2xl font-arabic font-bold text-[#0B281F]">تسجيل الدخول</CardTitle>
                        <CardDescription className="font-arabic text-sm text-gray-500">
                            أدخل بيانات الاعتماد الخاصة بك للوصول
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-5 px-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-right block font-arabic text-[#0B281F] mr-1">
                                    اسم المستخدم
                                </label>
                                <Input
                                    type="text"
                                    placeholder="أدخل اسم المستخدم"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="text-right font-arabic focus-visible:ring-[#D4AF37] h-12"
                                    dir="rtl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-right block font-arabic text-[#0B281F] mr-1">
                                    كلمة المرور
                                </label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="text-right focus-visible:ring-[#D4AF37] h-12"
                                    dir="rtl"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full bg-[#D4AF37] hover:bg-[#B4941F] text-[#0B281F] font-arabic font-bold h-12 shadow-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? "جاري الدخول..." : "دخول للوحة التحكم"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
                <div className="mt-8 text-center" dir="ltr">
                    <a href="/" className="text-white/60 hover:text-[#D4AF37] font-arabic text-sm transition-colors flex items-center justify-center gap-2">
                        <span>العودة للموقع</span>
                        <span>←</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
