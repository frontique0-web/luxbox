import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, DollarSign, Calculator, Eye } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Setting } from "@shared/schema";

export default function AdminSettings() {
    const { toast } = useToast();
    const [exchangeRate, setExchangeRate] = useState<string>("");
    const [currency, setCurrency] = useState<string>("USD");

    const { data: settings, isLoading } = useQuery<Setting>({
        queryKey: ["/api/settings"],
        // Automatically populate local state when data loads
        staleTime: 0,
    });

    // Use an effect to sync fetched data with local state for the form
    useEffect(() => {
        if (settings) {
            setExchangeRate(settings.exchangeRate);
            setCurrency(settings.currency);
        }
    }, [settings]);

    const mutation = useMutation({
        mutationFn: async (newSettings: Partial<Setting>) => {
            // Create settings endpoint (need to implement in backend)
            const res = await apiRequest("POST", "/api/admin/settings", newSettings);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
            toast({
                title: "تم الحفظ بنجاح",
                description: "تم تحديث إعدادات المتجر.",
            });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "خطأ",
                description: "فشل حفظ الإعدادات. حاول مرة أخرى.",
            });
        },
    });

    const handleSave = () => {
        mutation.mutate({ exchangeRate, currency });
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold tracking-tight text-[#0B281F] font-arabic">إعدادات المتجر</h2>
                <p className="text-muted-foreground font-arabic mt-1">
                    إدارة إعدادات العملة وسعر الصرف العام في الموقع
                </p>
            </div>

            <Card className="shadow-lg border-0" dir="rtl">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle className="font-arabic font-bold text-xl flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                        إعدادات العملات والتسعير
                    </CardTitle>
                    <CardDescription className="font-arabic">
                        يتم تطبيق هذه الإعدادات على جميع المنتجات في الموقع فورياً.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-6">

                    <div className="space-y-4">
                        <Label className="text-lg font-arabic font-bold text-[#0B281F]">عملة العرض الافتراضية</Label>
                        <p className="text-sm text-gray-500 font-arabic mb-4">
                            اختر العملة التي سيشاهدها الزوار على الموقع. إذا اخترت الليرة السورية، سيتم ضرب السعر الأساسي بالدولار مع سعر الصرف.
                        </p>
                        <RadioGroup
                            value={currency}
                            onValueChange={setCurrency}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="USD" id="usd" className="peer sr-only" />
                                <Label
                                    htmlFor="usd"
                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-transparent p-4 hover:bg-gray-50 hover:text-[#0B281F] peer-data-[state=checked]:border-[#D4AF37] peer-data-[state=checked]:bg-[#D4AF37]/10 peer-data-[state=checked]:text-[#0B281F] cursor-pointer"
                                >
                                    <DollarSign className="mb-3 h-6 w-6" />
                                    <span className="font-bold font-arabic">الدولار الأمريكي ($)</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="SYP" id="syp" className="peer sr-only" />
                                <Label
                                    htmlFor="syp"
                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-200 bg-transparent p-4 hover:bg-gray-50 hover:text-[#0B281F] peer-data-[state=checked]:border-[#D4AF37] peer-data-[state=checked]:bg-[#D4AF37]/10 peer-data-[state=checked]:text-[#0B281F] cursor-pointer"
                                >
                                    <span className="mb-3 font-bold text-2xl font-sans leading-none">SYP</span>
                                    <span className="font-bold font-arabic">الليرة السورية (ل.س)</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-4 pt-6 mt-6 border-t border-gray-100">
                        <Label className="text-lg font-arabic font-bold text-[#0B281F] flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-[#D4AF37]" />
                            سعر صرف الليرة السورية مقابل الدولار
                        </Label>
                        <p className="text-sm text-gray-500 font-arabic">
                            أدخل سعر الصرف هنا. مثلاً إذا كان السعر 15000 ل.س، اكتب "15000". سيتم استخدامه آلياً.
                        </p>
                        <div className="flex items-center gap-3 w-full max-w-xs relative">
                            <Input
                                type="number"
                                value={exchangeRate}
                                onChange={(e) => setExchangeRate(e.target.value)}
                                className="font-sans text-xl h-14 pr-12 focus-visible:ring-[#D4AF37]"
                                dir="ltr"
                            />
                            <span className="absolute right-4 font-arabic font-bold text-gray-400">ل.س</span>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="bg-gray-50/50 border-t border-gray-100 p-6 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={mutation.isPending}
                        className="bg-[#0B281F] hover:bg-[#143D30] text-[#D4AF37] font-arabic font-bold h-12 px-8 shadow-lg gap-2"
                    >
                        {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        حفظ الإعدادات
                    </Button>
                </CardFooter>
            </Card>

            {/* Preview Card */}
            <Card className="border border-[#D4AF37]/30 bg-[#D4AF37]/5 shadow-sm p-6" dir="rtl">
                <h3 className="font-arabic font-bold text-[#0B281F] mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#D4AF37]" />
                    معاينة التسعير المباشر
                </h3>
                <p className="font-arabic text-sm text-gray-600 mb-4">هكذا سيظهر منتج بقيمة 10 دولار على الموقع حالياً:</p>

                <div className="bg-white rounded-lg p-4 border border-gray-200 inline-block min-w-[200px] text-center shadow-sm">
                    <span className="font-sans text-2xl font-bold text-[#D4AF37]">
                        {currency === "USD"
                            ? "$10"
                            : `${(10 * Number(exchangeRate || 0)).toLocaleString()} ل.س`}
                    </span>
                </div>
            </Card>
        </div>
    );
}
