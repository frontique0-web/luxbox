import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Tags, CheckCircle2, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type DashboardStats = {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    totalCategories: number;
};

export default function AdminDashboard() {
    const { data: stats, isLoading } = useQuery<DashboardStats>({
        queryKey: ["/api/admin/stats"],
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#0B281F] font-arabic">لوحة التحكم</h2>
                <p className="text-muted-foreground font-arabic mt-2">
                    نظرة عامة على إحصائيات وأداء المتجر.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-[#D4AF37]/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium font-arabic text-gray-500 text-right">
                            إجمالي المنتجات
                        </CardTitle>
                        <Package className="h-4 w-4 text-[#D4AF37]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0B281F]">{isLoading ? "..." : stats?.totalProducts || 0}</div>
                        <p className="text-xs text-muted-foreground font-arabic mt-1">منتج مسجل في النظام</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-[#D4AF37]/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium font-arabic text-gray-500 text-right">
                            الأقسام والتصنيفات
                        </CardTitle>
                        <Tags className="h-4 w-4 text-[#D4AF37]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#0B281F]">{isLoading ? "..." : stats?.totalCategories || 0}</div>
                        <p className="text-xs text-muted-foreground font-arabic mt-1">قسم رئيسي</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-green-500/20 bg-green-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium font-arabic text-green-700 text-right">
                            المنتجات المعروضة
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700">{isLoading ? "..." : stats?.activeProducts || 0}</div>
                        <p className="text-xs text-green-600/70 font-arabic mt-1">منتج يظهر للعملاء</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-red-500/20 bg-red-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium font-arabic text-red-700 text-right">
                            المنتجات المخفية
                        </CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-700">{isLoading ? "..." : stats?.inactiveProducts || 0}</div>
                        <p className="text-xs text-red-600/70 font-arabic mt-1">منتج تم إيقاف عرضه</p>
                    </CardContent>
                </Card>
            </div>


        </div>
    );
}
