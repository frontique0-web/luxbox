import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FolderPlus, Pencil, Trash2, Plus, Loader2, ListTree, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Category, Subcategory } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const CATEGORY_IMAGES: Record<string, string> = {
    perfumes: "/assets/categories/perfumes.png",
    makeup_care: "/assets/categories/makeup.png",
    watches: "/assets/categories/watches.png",
    accessories: "/assets/categories/accessories.png",
    bags: "/assets/categories/bags.png",
    mobile: "/assets/categories/mobile-covers.png",
    vape: "/assets/categories/vape.png",
};

export default function AdminCategories() {
    const { toast } = useToast();
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    // Form state
    const [nameAr, setNameAr] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [slug, setSlug] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // Quick fetch of categories
    const { data: categories = [], isLoading } = useQuery<Category[]>({
        queryKey: ["/api/categories"],
    });

    // Subcategories Modal State
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [newSubcatNameAr, setNewSubcatNameAr] = useState("");
    const [newSubcatNameEn, setNewSubcatNameEn] = useState("");
    const [subcatToDelete, setSubcatToDelete] = useState<number | null>(null);

    const { data: subcategories = [], isLoading: subcategoriesLoading } = useQuery<Subcategory[]>({
        queryKey: ["/api/categories", selectedCategoryId, "subcategories"],
        queryFn: async () => {
            if (!selectedCategoryId) return [];
            const res = await fetch(`/api/categories/${selectedCategoryId}/subcategories`);
            if (!res.ok) throw new Error("Failed to fetch subcategories");
            return res.json();
        },
        enabled: !!selectedCategoryId,
    });

    const createMutation = useMutation({
        mutationFn: async (newCategory: any) => {
            const res = await apiRequest("POST", "/api/admin/categories", newCategory);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            setIsCategoryModalOpen(false);
            setNameAr("");
            setNameEn("");
            setSlug("");
            setImageUrl("");
            toast({
                title: "تم الإضافة بنجاح",
                description: "تمت إضافة القسم الرئيسي الجديد للمتجر.",
            });
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "خطأ",
                description: "حدث خطأ أثناء إضافة القسم. تأكد من صحة الرابط (Slug).",
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/admin/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            toast({
                title: "تم الحذف",
                description: "تم حذف القسم بنجاح.",
            });
            setCategoryToDelete(null);
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "خطأ",
                description: "حدث خطأ أثناء الحذف. تأكد من عدم وجود منتجات مرتبطة بهذا القسم.",
            });
            setCategoryToDelete(null);
        }
    });

    const confirmCategoryDelete = () => {
        if (categoryToDelete !== null) {
            deleteMutation.mutate(categoryToDelete);
        }
    };

    const handleCreate = () => {
        if (!nameAr || !nameEn || !slug) {
            toast({
                variant: "destructive",
                title: "بيانات ناقصة",
                description: "يرجى تعبئة جميع الحقول.",
            });
            return;
        }
        createMutation.mutate({ nameAr, nameEn, slug, imageUrl, displayOrder: categories.length });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                toast({
                    variant: "destructive",
                    title: "خطأ في حجم الصورة",
                    description: "حجم الصورة يجب أن لا يتجاوز 50 ميجابايت",
                });
                return;
            }

            const originalReader = new FileReader();
            originalReader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const MAX_WIDTH = 800; // Define max width for compression

                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to WebP or JPEG with quality setting
                    const compressedBase64 = canvas.toDataURL("image/webp", 0.75); // 0.75 is the quality
                    setImageUrl(compressedBase64);
                };
                img.src = originalReader.result as string;
            };
            originalReader.readAsDataURL(file);
        }
    };

    const createSubcatMutation = useMutation({
        mutationFn: async (newSubcategory: any) => {
            const res = await apiRequest("POST", "/api/admin/subcategories", newSubcategory);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/categories", selectedCategoryId, "subcategories"] });
            setNewSubcatNameAr("");
            setNewSubcatNameEn("");
            toast({ title: "تم الإضافة", description: "تمت إضافة القسم الفرعي بنجاح." });
        },
        onError: () => toast({ variant: "destructive", title: "خطأ", description: "حدث خطأ أثناء الإضافة." })
    });

    const deleteSubcatMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/admin/subcategories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/categories", selectedCategoryId, "subcategories"] });
            toast({ title: "تم الحذف", description: "تم حذف القسم الفرعي بنجاح." });
            setSubcatToDelete(null);
        },
        onError: () => {
            toast({ variant: "destructive", title: "خطأ", description: "حدث خطأ أثناء الحذف." });
            setSubcatToDelete(null);
        }
    });

    const confirmSubcatDelete = () => {
        if (subcatToDelete !== null) {
            deleteSubcatMutation.mutate(subcatToDelete);
        }
    };

    const handleCreateSubcat = () => {
        if (!newSubcatNameAr || !selectedCategoryId) {
            toast({ variant: "destructive", title: "خطأ", description: "يرجى إدخال اسم القسم الفرعي بالعربية على الأقل." });
            return;
        }
        createSubcatMutation.mutate({
            categoryId: selectedCategoryId,
            nameAr: newSubcatNameAr,
            nameEn: newSubcatNameEn,
            displayOrder: subcategories.length
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#0B281F] font-arabic">إدارة الأقسام</h2>
                    <p className="text-muted-foreground font-arabic mt-1">
                        إضافة وتعديل الأقسام الرئيسية والفرعية للمتجر
                    </p>
                </div>

                <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#0B281F] hover:bg-[#143D30] text-[#D4AF37] font-arabic gap-2">
                            <FolderPlus className="w-4 h-4" />
                            إضافة قسم رئيسي
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]" dir="rtl">
                        <DialogHeader>
                            <DialogTitle className="font-arabic text-right">إضافة قسم جديد</DialogTitle>
                            <DialogDescription className="font-arabic text-right text-gray-500">
                                أدخل تفاصيل القسم الرئيسي الجديد هنا.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label className="text-right block font-arabic mb-2">صورة القسم</Label>
                                <div
                                    className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group relative"
                                    onClick={() => document.getElementById('category-image-upload')?.click()}
                                >
                                    {imageUrl ? (
                                        <div className="relative w-full aspect-video max-h-[150px] overflow-hidden rounded-lg">
                                            <img src={imageUrl} alt="Preview" className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-arabic font-medium flex items-center gap-2">
                                                    <Upload className="w-4 h-4" />
                                                    تغيير الصورة
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-4 text-gray-500">
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                                                <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                                            </div>
                                            <p className="font-arabic font-medium mb-1 group-hover:text-[#0B281F] transition-colors text-sm">انقر لرفع صورة</p>
                                            <p className="text-[10px] text-gray-400">PNG, JPG حتى 5MB</p>
                                        </div>
                                    )}
                                    <input
                                        id="category-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nameAr" className="text-right block font-arabic">الاسم (عربي)</Label>
                                <Input id="nameAr" value={nameAr} onChange={e => setNameAr(e.target.value)} placeholder="مثال: عطورات" className="text-right font-arabic" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nameEn" className="text-right block font-arabic">الاسم (انجليزي)</Label>
                                <Input id="nameEn" value={nameEn} onChange={e => setNameEn(e.target.value)} placeholder="مثال: Perfumes" className="text-right" dir="ltr" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-right block font-arabic">الرابط (Slug)</Label>
                                <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} placeholder="مثال: perfumes" className="text-right" dir="ltr" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={createMutation.isPending} type="button" className="bg-[#D4AF37] hover:bg-[#B4941F] text-[#0B281F] font-arabic w-full gap-2">
                                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                حفظ التغييرات
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-0 shadow-lg overflow-hidden bg-white/50 backdrop-blur-sm">
                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                    <Table dir="rtl">
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="text-right font-arabic font-bold text-gray-500 w-16">صورة</TableHead>
                                <TableHead className="text-right font-arabic font-bold w-[250px]">القسم الرئيسي</TableHead>
                                <TableHead className="text-right font-arabic font-bold">الاسم الإنجليزي</TableHead>
                                <TableHead className="text-right font-arabic font-bold">الرابط</TableHead>
                                <TableHead className="text-center font-arabic font-bold w-[150px]">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#D4AF37]" />
                                    </TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center font-arabic text-gray-500">
                                        لا توجد أقسام مسجلة حالياً.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell>
                                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm relative group">
                                                {category.imageUrl || CATEGORY_IMAGES[category.slug] ? (
                                                    <img src={category.imageUrl || CATEGORY_IMAGES[category.slug]} alt={category.nameAr} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                ) : (
                                                    <ImageIcon className="w-4 h-4 text-gray-300" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-arabic font-medium">{category.nameAr}</TableCell>
                                        <TableCell>{category.nameEn}</TableCell>
                                        <TableCell className="text-gray-500 text-sm" dir="ltr">{category.slug}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg border-gray-200 text-green-600 hover:bg-green-50 hover:border-green-200"
                                                    title="إدارة الأقسام الفرعية"
                                                    onClick={() => setSelectedCategoryId(category.id)}
                                                >
                                                    <ListTree className="w-4 h-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200" title="تعديل">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200"
                                                    onClick={() => setCategoryToDelete(category.id)}
                                                    disabled={deleteMutation.isPending}
                                                    title="حذف"
                                                >
                                                    {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile View (Cards) */}
                <div className="md:hidden flex flex-col gap-3 p-3">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-gray-500 font-arabic text-center">
                            <p>لا توجد أقسام مسجلة حالياً.</p>
                        </div>
                    ) : (
                        categories.map((category) => (
                            <div key={category.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col gap-3 relative overflow-hidden">
                                <div className="flex gap-3 items-center">
                                    <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                                        {category.imageUrl || CATEGORY_IMAGES[category.slug] ? (
                                            <img src={category.imageUrl || CATEGORY_IMAGES[category.slug]} alt={category.nameAr} className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <h3 className="font-arabic font-bold text-[#0B281F] text-base truncate">{category.nameAr}</h3>
                                        <p className="text-gray-500 text-sm truncate">{category.nameEn}</p>
                                        <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 mt-1 rounded-md w-fit truncate max-w-full block" dir="ltr">/{category.slug}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-3 mt-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 font-arabic text-xs text-green-600 hover:bg-green-50 hover:border-green-200 rounded-lg border-gray-200"
                                        onClick={() => setSelectedCategoryId(category.id)}
                                    >
                                        <ListTree className="w-3.5 w-3.5 ml-1.5" />
                                        تفرعات
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 font-arabic text-xs text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg border-gray-200"
                                    >
                                        <Pencil className="h-3.5 w-3.5 ml-1.5" />
                                        تعديل
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCategoryToDelete(category.id)}
                                        disabled={deleteMutation.isPending}
                                        className="h-9 font-arabic text-xs hover:bg-red-50 text-red-600 hover:border-red-200 rounded-lg border-gray-200"
                                    >
                                        {deleteMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin ml-1.5" /> : <Trash2 className="w-3.5 h-3.5 ml-1.5" />}
                                        حذف
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            {/* Subcategories Management Modal */}
            <Dialog open={!!selectedCategoryId} onOpenChange={(open) => !open && setSelectedCategoryId(null)}>
                <DialogContent className="sm:max-w-[500px]" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="font-arabic text-right">إدارة الأقسام الفرعية</DialogTitle>
                        <DialogDescription className="font-arabic text-right text-gray-500">
                            أضف أو احذف الأقسام الفرعية التابعة للقسم الرئيسي המحدد.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="bg-gray-50 border rounded-lg p-4 max-h-[250px] overflow-y-auto">
                            {subcategoriesLoading ? (
                                <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" /></div>
                            ) : subcategories.length === 0 ? (
                                <p className="text-center text-gray-500 font-arabic text-sm">لا توجد أقسام فرعية مسجلة حالياً.</p>
                            ) : (
                                <Table>
                                    <TableBody>
                                        {subcategories.map(sub => (
                                            <TableRow key={sub.id}>
                                                <TableCell className="font-arabic">{sub.nameAr}</TableCell>
                                                <TableCell className="text-left" dir="ltr">{sub.nameEn}</TableCell>
                                                <TableCell className="text-left w-[50px]">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                                                        onClick={() => setSubcatToDelete(sub.id)}
                                                        disabled={deleteSubcatMutation.isPending}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="space-y-2">
                                <Label className="text-right block font-arabic text-xs">الاسم (عربي) *</Label>
                                <Input value={newSubcatNameAr} onChange={e => setNewSubcatNameAr(e.target.value)} placeholder="مثال: أصلي" className="text-right font-arabic h-9" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-right block font-arabic text-xs">الاسم (إنجليزي)</Label>
                                <Input value={newSubcatNameEn} onChange={e => setNewSubcatNameEn(e.target.value)} placeholder="Original" className="text-left h-9" dir="ltr" />
                            </div>
                        </div>
                        <Button
                            onClick={handleCreateSubcat}
                            disabled={createSubcatMutation.isPending}
                            className="bg-[#0B281F] hover:bg-[#143D30] text-[#D4AF37] font-arabic w-full gap-2 mt-2 h-10"
                        >
                            {createSubcatMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            إضافة قسم فرعي
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Notice about subcategories */}
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex gap-3 text-sm font-arabic">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">i</div>
                <p>يمكنك التعديل لاحقاً على الماركات بنفس الآلية من خلال واجهات تفصيلية سيتم إضافتها.</p>
            </div>

            {/* Category Delete Confirmation */}
            <AlertDialog open={categoryToDelete !== null} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
                <AlertDialogContent dir="rtl" className="font-arabic">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
                        <AlertDialogDescription className="text-right">
                            هل أنت متأكد من حذف هذا القسم نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex items-center gap-2 sm:justify-start">
                        <AlertDialogCancel className="mt-0">إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmCategoryDelete} className="bg-red-600 hover:bg-red-700 text-white m-0 sm:m-0">
                            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Trash2 className="w-4 h-4 ml-2" />}
                            حذف نهائي
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Subcategory Delete Confirmation */}
            <AlertDialog open={subcatToDelete !== null} onOpenChange={(open) => !open && setSubcatToDelete(null)}>
                <AlertDialogContent dir="rtl" className="font-arabic">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
                        <AlertDialogDescription className="text-right">
                            هل أنت متأكد من حذف هذا القسم الفرعي نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex items-center gap-2 sm:justify-start">
                        <AlertDialogCancel className="mt-0">إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmSubcatDelete} className="bg-red-600 hover:bg-red-700 text-white m-0 sm:m-0">
                            {deleteSubcatMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Trash2 className="w-4 h-4 ml-2" />}
                            حذف نهائي
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
