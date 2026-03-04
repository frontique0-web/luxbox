import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Loader2, Upload, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { HeroSlider } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export default function AdminHeroSliders() {
    const { toast } = useToast();

    // Modal State
    const [isSliderModalOpen, setIsSliderModalOpen] = useState(false);
    const [sliderToDelete, setSliderToDelete] = useState<number | null>(null);

    // Form state
    const [imageUrl, setImageUrl] = useState("");
    const [displayOrder, setDisplayOrder] = useState(0);

    const { data: sliders = [], isLoading } = useQuery<HeroSlider[]>({
        queryKey: ["/api/admin/hero-sliders"],
        queryFn: async () => {
            const res = await fetch("/api/admin/hero-sliders");
            if (!res.ok) throw new Error("Failed to fetch hero sliders");
            return res.json();
        }
    });

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, isActive }: { id: number, isActive: boolean }) => {
            await apiRequest("PATCH", `/api/admin/hero-sliders/${id}`, { isActive });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-sliders"] });
            toast({ title: "تم التحديث", description: "تم تحديث حالة عرض الصورة بنجاح." });
        },
        onError: () => toast({ variant: "destructive", title: "خطأ", description: "حدث خطأ أثناء تحديث الحالة." })
    });

    const saveMutation = useMutation({
        mutationFn: async (sliderData: any) => {
            const res = await apiRequest("POST", "/api/admin/hero-sliders", sliderData);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-sliders"] });
            setIsSliderModalOpen(false);
            resetForm();
            toast({
                title: "تم الإضافة بنجاح",
                description: "تمت إضافة صورة الواجهة بنجاح.",
            });
        },
        onError: (error: Error) => {
            toast({
                variant: "destructive",
                title: "خطأ",
                description: "حدث خطأ أثناء حفظ الصورة. يرجى المحاولة لاحقاً.",
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/admin/hero-sliders/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-sliders"] });
            toast({ title: "تم الحذف", description: "تم حذف الصورة بنجاح." });
            setSliderToDelete(null);
        },
        onError: () => {
            toast({ variant: "destructive", title: "خطأ", description: "حدث خطأ أثناء الحذف." });
            setSliderToDelete(null);
        }
    });

    const confirmDelete = () => {
        if (sliderToDelete) {
            deleteMutation.mutate(sliderToDelete);
        }
    };

    const resetForm = () => {
        setImageUrl("");
        setDisplayOrder(sliders.length);
    };

    const handleOpenCreateMode = () => {
        if (sliders.length >= 5) {
            toast({
                variant: "destructive",
                title: "الحد الأقصى",
                description: "لا يمكن إضافة أكثر من 5 صور للواجهة.",
            });
            return;
        }
        resetForm();
        setIsSliderModalOpen(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageSetter: React.Dispatch<React.SetStateAction<string>>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast({
                    variant: "destructive",
                    title: "خطأ في حجم الصورة",
                    description: "حجم الصورة يجب أن لا يتجاوز 10 ميجابايت",
                });
                return;
            }

            const originalReader = new FileReader();
            originalReader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const MAX_WIDTH = 1920;

                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL("image/webp", 0.85);
                    imageSetter(compressedBase64);
                };
                img.src = originalReader.result as string;
            };
            originalReader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!imageUrl) {
            toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى اختيار صورة للواجهة." });
            return;
        }

        saveMutation.mutate({
            imageUrl,
            displayOrder: Number(displayOrder),
            isActive: true,
        });
    };

    const handleDelete = (id: number) => {
        setSliderToDelete(id);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#0B281F] font-arabic">إدارة صور الواجهة</h2>
                    <p className="text-muted-foreground font-arabic mt-1">
                        إضافة وإدارة صور واجهة المتجر (الحد الأقصى 5 صور)
                    </p>
                </div>
                <Button onClick={handleOpenCreateMode} disabled={sliders.length >= 5} className="bg-[#0B281F] hover:bg-[#143D30] text-[#D4AF37] font-arabic gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة صورة جديدة
                </Button>
            </div>

            <Dialog open={isSliderModalOpen} onOpenChange={(open) => {
                if (!open) resetForm();
                setIsSliderModalOpen(open);
            }}>
                <DialogContent className="sm:max-w-[500px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="font-arabic text-right">إضافة صورة واجهة</DialogTitle>
                        <DialogDescription className="font-arabic text-right text-gray-500">
                            قم برفع صورة لعرضها في السلايدر الخاص بواجهة المتجر الرئيسية.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayOrder" className="text-right block font-arabic">الترتيب</Label>
                            <Input id="displayOrder" type="number" value={displayOrder} onChange={e => setDisplayOrder(parseInt(e.target.value))} className="text-right font-arabic" />
                        </div>
                        <div className="space-y-4">
                            <Label className="text-right block font-arabic mb-2">صورة الواجهة *</Label>
                            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group relative" onClick={() => document.getElementById('image-upload-hero')?.click()}>
                                {imageUrl ? (
                                    <div className="relative w-full h-32 md:h-48 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white font-arabic text-sm font-medium flex items-center gap-2">
                                                <Upload className="w-4 h-4" />
                                                تغيير
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                                            <ImageIcon className="w-6 h-6 text-[#D4AF37]" />
                                        </div>
                                        <p className="font-arabic text-sm font-medium mb-1 group-hover:text-[#0B281F] transition-colors">انقر لاختيار الصورة</p>
                                        <p className="font-sans text-xs text-gray-400">1920x1080 مستحسن</p>
                                    </div>
                                )}
                                <input
                                    id="image-upload-hero"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, setImageUrl)}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleSave}
                            disabled={saveMutation.isPending}
                            type="button"
                            className="bg-[#D4AF37] hover:bg-[#B4941F] text-[#0B281F] font-arabic w-full gap-2"
                        >
                            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            إضافة الصورة
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Card className="border-0 shadow-lg overflow-hidden bg-white/50 backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <Table dir="rtl">
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="text-right font-arabic font-bold text-gray-500 w-32">الصورة</TableHead>
                                <TableHead className="text-right font-arabic font-bold text-gray-500">الترتيب</TableHead>
                                <TableHead className="text-right font-arabic font-bold text-gray-500">الحالة</TableHead>
                                <TableHead className="text-center font-arabic font-bold text-gray-500">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#D4AF37]" />
                                    </TableCell>
                                </TableRow>
                            ) : sliders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center font-arabic text-gray-500 flex-col items-center justify-center">
                                        <ImageIcon className="w-12 h-12 text-gray-300 mb-3 mx-auto" />
                                        لا توجد صور مضافة للواجهة.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {sliders.map((slider) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            key={slider.id}
                                            className="border-b transition-colors hover:bg-gray-50/80"
                                        >
                                            <TableCell>
                                                <div className="w-32 h-16 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm relative group">
                                                    {slider.imageUrl ? (
                                                        <img src={slider.imageUrl} alt="Slider" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5 text-gray-300" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-sans font-bold text-[#0B281F] bg-gray-100 px-3 py-1 rounded-md">{slider.displayOrder}</span>
                                            </TableCell>
                                            <TableCell>
                                                {slider.isActive ? (
                                                    <Badge className="bg-emerald-100 text-emerald-700 font-arabic border-0 shadow-none">مفعل</Badge>
                                                ) : (
                                                    <Badge className="bg-rose-100 text-rose-700 font-arabic border-0 shadow-none">مخفي</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => toggleStatusMutation.mutate({ id: slider.id, isActive: !slider.isActive })}
                                                        className={`h-8 w-8 rounded-lg border-gray-200 ${slider.isActive ? 'hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200' : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'}`}
                                                        disabled={toggleStatusMutation.isPending}
                                                    >
                                                        {slider.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDelete(slider.id)}
                                                        className="h-8 w-8 rounded-lg border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <AlertDialog open={sliderToDelete !== null} onOpenChange={(open) => !open && setSliderToDelete(null)}>
                <AlertDialogContent dir="rtl" className="font-arabic">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
                        <AlertDialogDescription className="text-right">
                            هل أنت متأكد من حذف هذه الصورة نهائياً؟
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex items-center gap-2 sm:justify-start">
                        <AlertDialogCancel className="mt-0">إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white m-0 sm:m-0">
                            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Trash2 className="w-4 h-4 ml-2" />}
                            حذف نهائي
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
