import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Loader2, Upload, Image as ImageIcon, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product, Category, Subcategory } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function AdminProducts() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageUrl2, setImageUrl2] = useState("");
    const [imageUrl3, setImageUrl3] = useState("");
    const [badge, setBadge] = useState("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [subcategoryId, setSubcategoryId] = useState<string>("");

    // Fetch Categories for the dropdown
    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ["/api/categories"],
        queryFn: async () => {
            const res = await fetch("/api/categories");
            if (!res.ok) throw new Error("Failed to fetch categories");
            return res.json();
        }
    });

    // Fetch Subcategories based on selected category
    const { data: subcategories = [] } = useQuery<Subcategory[]>({
        queryKey: ["/api/categories", categoryId, "subcategories"],
        queryFn: async () => {
            if (!categoryId) return [];
            const res = await fetch(`/api/categories/${categoryId}/subcategories`);
            if (!res.ok) throw new Error("Failed to fetch subcategories");
            return res.json();
        },
        enabled: !!categoryId,
    });

    const { data: products = [], isLoading } = useQuery<Product[]>({
        queryKey: ["/api/admin/products", searchTerm],
        queryFn: async () => {
            const res = await fetch("/api/admin/products");
            if (!res.ok) throw new Error("Failed to fetch products");
            const allProducts: Product[] = await res.json();

            if (!searchTerm) return allProducts;

            return allProducts.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
    });

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, isActive }: { id: number, isActive: boolean }) => {
            await apiRequest("PATCH", `/api/admin/products/${id}/status`, { isActive });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
            toast({ title: "تم التحديث", description: "تم تحديث حالة عرض المنتج بنجاح." });
        },
        onError: () => toast({ variant: "destructive", title: "خطأ", description: "حدث خطأ أثناء تحديث الحالة." })
    });

    const saveMutation = useMutation({
        mutationFn: async (productData: any) => {
            if (editingProduct) {
                const res = await apiRequest("PATCH", `/api/admin/products/${editingProduct.id}`, productData);
                return res.json();
            } else {
                const res = await apiRequest("POST", "/api/admin/products", productData);
                return res.json();
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
            setIsProductModalOpen(false);
            resetForm();
            toast({
                title: editingProduct ? "تم التعديل" : "تم الإضافة بنجاح",
                description: editingProduct ? "تم تحديث بيانات المنتج." : "تمت إضافة المنتج الجديد للمتجر.",
            });
        },
        onError: (error: Error) => {
            let description = "حدث خطأ أثناء حفظ المنتج. يرجى التأكد من البيانات وإعادة المحاولة.";
            if (error.message.includes("مستخدم بالفعل") || error.message.includes("Unique constraint")) {
                description = "كود المنتج مستخدم بالفعل في منتج آخر. يرجى تحديد كود مختلف (5 أرقام).";
            }
            toast({
                variant: "destructive",
                title: "خطأ",
                description,
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/admin/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
            toast({ title: "تم الحذف", description: "تم حذف المنتج بنجاح." });
            setProductToDelete(null);
        },
        onError: () => {
            toast({ variant: "destructive", title: "خطأ", description: "حدث خطأ أثناء الحذف." });
            setProductToDelete(null);
        }
    });

    const confirmDelete = () => {
        if (productToDelete) {
            deleteMutation.mutate(productToDelete);
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setName("");
        setCode("");
        setPrice("");
        setDescription("");
        setImageUrl3("");
        setBadge("");
        setCategoryId("");
        setSubcategoryId("");
    };

    const handleOpenCreateMode = () => {
        resetForm();
        setIsProductModalOpen(true);
    };

    const handleOpenEditMode = (product: Product) => {
        setEditingProduct(product);
        setName(product.name);
        setCode(product.code || "");
        setPrice(product.price);
        setDescription(product.description || "");
        setImageUrl(product.imageUrl || "");
        setImageUrl2(product.imageUrl2 || "");
        setImageUrl3(product.imageUrl3 || "");
        setBadge(product.badge || "");
        setCategoryId(product.categoryId?.toString() || "");
        setSubcategoryId(product.subcategoryId?.toString() || "");
        setIsProductModalOpen(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageSetter: React.Dispatch<React.SetStateAction<string>>) => {
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
                    imageSetter(compressedBase64);
                };
                img.src = originalReader.result as string;
            };
            originalReader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!name || !price || !categoryId || !code) {
            toast({ variant: "destructive", title: "بيانات ناقصة", description: "يرجى تعبئة الاسم والسعر والقسم وكود المنتج." });
            return;
        }

        if (!/^\d{5}$/.test(code)) {
            toast({ variant: "destructive", title: "كود غير صالح", description: "يجب أن يتكون كود المنتج من 5 أرقام فقط." });
            return;
        }

        saveMutation.mutate({
            name,
            code,
            price,
            description,
            imageUrl,
            imageUrl2,
            imageUrl3,
            badge,
            categoryId: parseInt(categoryId),
            subcategoryId: subcategoryId ? parseInt(subcategoryId) : null,
            displayOrder: editingProduct ? editingProduct.displayOrder : products.length,
            isActive: editingProduct ? editingProduct.isActive : true,
        });
    };

    const handleDelete = (id: number) => {
        setProductToDelete(id);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#0B281F] font-arabic">إدارة المنتجات</h2>
                    <p className="text-muted-foreground font-arabic mt-1">
                        عرض، إضافة، وتعديل المنتجات وإيقاف عرضها
                    </p>
                </div>
                <Button onClick={handleOpenCreateMode} className="bg-[#0B281F] hover:bg-[#143D30] text-[#D4AF37] font-arabic gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة منتج جديد
                </Button>
            </div>

            <Dialog open={isProductModalOpen} onOpenChange={(open) => {
                if (!open) resetForm();
                setIsProductModalOpen(open);
            }}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="font-arabic text-right">{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
                        <DialogDescription className="font-arabic text-right text-gray-500">
                            أدخل تفاصيل المنتج مثل الاسم، السعر، والقسم التابع له.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-right block font-arabic">اسم المنتج *</Label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="مثال: عطر ديور" className="text-right font-arabic" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-right block font-arabic">كود المنتج (5 أرقام) *</Label>
                            <Input id="code" value={code} onChange={e => setCode(e.target.value)} maxLength={5} placeholder="مثال: 12345" className="text-right font-arabic" dir="ltr" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-right block font-arabic">السعر النصي *</Label>
                            <Input id="price" value={price} onChange={e => setPrice(e.target.value)} placeholder="اكتب السعر" className="text-right font-arabic" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-right block font-arabic">القسم الرئيسي *</Label>
                            <select
                                id="category"
                                value={categoryId}
                                onChange={e => {
                                    setCategoryId(e.target.value);
                                    setSubcategoryId("");
                                }}
                                className="w-full text-right font-arabic rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="" disabled>اختر القسم...</option>
                                {categories.map((cat: Category) => (
                                    <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
                                ))}
                            </select>
                        </div>
                        {subcategories.length > 0 && (
                            <div className="space-y-2">
                                <Label htmlFor="subcategory" className="text-right block font-arabic">القسم الفرعي</Label>
                                <select
                                    id="subcategory"
                                    value={subcategoryId}
                                    onChange={e => setSubcategoryId(e.target.value)}
                                    className="w-full text-right font-arabic rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">بدون قسم فرعي</option>
                                    {subcategories.map((sub: Subcategory) => (
                                        <option key={sub.id} value={sub.id}>{sub.nameAr}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-right block font-arabic">الوصف</Label>
                            <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="وصف قصير للمنتج" className="text-right font-arabic" />
                        </div>
                        <div className="space-y-4">
                            <Label className="text-right block font-arabic mb-2">صور المنتج (حتى 3 صور)</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Image 1 */}
                                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group relative" onClick={() => document.getElementById('image-upload-1')?.click()}>
                                    {imageUrl ? (
                                        <div className="relative w-full h-24 md:h-32 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                            <img src={imageUrl} alt="Preview 1" className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-arabic text-sm font-medium flex items-center gap-2">
                                                    <Upload className="w-4 h-4" />
                                                    تغيير
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-4 text-gray-500">
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                                                <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                                            </div>
                                            <p className="font-arabic text-sm font-medium mb-1 group-hover:text-[#0B281F] transition-colors">الصورة الرئيسية</p>
                                        </div>
                                    )}
                                    <input
                                        id="image-upload-1"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(e, setImageUrl)}
                                    />
                                </div>

                                {/* Image 2 */}
                                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group relative" onClick={() => document.getElementById('image-upload-2')?.click()}>
                                    {imageUrl2 ? (
                                        <div className="relative w-full h-24 md:h-32 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                            <img src={imageUrl2} alt="Preview 2" className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-arabic text-sm font-medium flex items-center gap-2">
                                                    <Upload className="w-4 h-4" />
                                                    تغيير
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setImageUrl2(""); }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 z-10"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-4 text-gray-500">
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                                                <ImageIcon className="w-5 h-5 text-gray-300" />
                                            </div>
                                            <p className="font-arabic text-sm font-medium mb-1 group-hover:text-[#0B281F] transition-colors">صورة إضافية 1</p>
                                        </div>
                                    )}
                                    <input
                                        id="image-upload-2"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(e, setImageUrl2)}
                                    />
                                </div>

                                {/* Image 3 */}
                                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group relative" onClick={() => document.getElementById('image-upload-3')?.click()}>
                                    {imageUrl3 ? (
                                        <div className="relative w-full h-24 md:h-32 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                            <img src={imageUrl3} alt="Preview 3" className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-arabic text-sm font-medium flex items-center gap-2">
                                                    <Upload className="w-4 h-4" />
                                                    تغيير
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setImageUrl3(""); }}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 z-10"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-4 text-gray-500">
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                                                <ImageIcon className="w-5 h-5 text-gray-300" />
                                            </div>
                                            <p className="font-arabic text-sm font-medium mb-1 group-hover:text-[#0B281F] transition-colors">صورة إضافية 2</p>
                                        </div>
                                    )}
                                    <input
                                        id="image-upload-3"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(e, setImageUrl3)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="badge" className="text-right block font-arabic">بطاقة العرض (شارة اختيارية)</Label>
                            <Input id="badge" value={badge} onChange={e => setBadge(e.target.value)} placeholder="مثال: NEW, ORIGINAL" className="text-right font-arabic" />
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
                            {editingProduct ? "حفظ التعديلات" : "إضافة المنتج"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex gap-4 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="ابحث عن منتج..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-4 pr-10 text-right font-arabic h-12 rounded-xl border-gray-200"
                        dir="rtl"
                    />
                </div>
            </div>

            <Card className="border-0 shadow-lg overflow-hidden bg-white/50 backdrop-blur-sm">
                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                    <Table dir="rtl">
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="text-right font-arabic font-bold text-gray-500 w-16">صورة</TableHead>
                                <TableHead className="text-right font-arabic font-bold text-gray-500 w-[25%]">اسم المنتج</TableHead>
                                <TableHead className="text-right font-arabic font-bold text-gray-500">الكود</TableHead>
                                <TableHead className="text-right font-arabic font-bold text-gray-500">القسم</TableHead>
                                <TableHead className="text-right font-arabic font-bold text-gray-500">السعر</TableHead>
                                <TableHead className="text-right font-arabic font-bold text-gray-500">الحالة</TableHead>
                                <TableHead className="text-center font-arabic font-bold text-gray-500">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#D4AF37]" />
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center font-arabic text-gray-500 flex-col items-center justify-center">
                                        <Package className="w-12 h-12 text-gray-300 mb-3 mx-auto" />
                                        لا توجد منتجات مطابقة لبحثك.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {products.map((product) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                            transition={{ duration: 0.2 }}
                                            key={product.id}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted hover:bg-gray-50/80"
                                        >
                                            <TableCell>
                                                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm relative group">
                                                    {product.imageUrl ? (
                                                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5 text-gray-300" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-arabic font-bold text-[#0B281F]">{product.name}</span>
                                                    {product.badge && (
                                                        <Badge variant="outline" className="w-fit text-[10px] px-1.5 py-0 h-4 border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5">{product.badge}</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-sans font-bold text-[#0B281F] bg-gray-100 px-2 py-1 rounded-md" dir="ltr">{product.code}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col font-arabic text-sm">
                                                    <span className="text-[#0B281F] font-medium">القسم {product.categoryId}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-sans font-bold text-[#D4AF37] bg-[#D4AF37]/5 px-2 py-1 rounded-md" dir="ltr">{product.price}</span>
                                            </TableCell>
                                            <TableCell>
                                                {product.isActive ? (
                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 font-arabic border-0 shadow-none">مفعل</Badge>
                                                ) : (
                                                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 font-arabic border-0 shadow-none">مخفي</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => toggleStatusMutation.mutate({ id: product.id, isActive: !product.isActive })}
                                                        className={`h-8 w-8 rounded-lg border-gray-200 ${product.isActive ? 'hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200' : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'}`}
                                                        title={product.isActive ? "إخفاء المنتج" : "إظهار المنتج"}
                                                        disabled={toggleStatusMutation.isPending}
                                                    >
                                                        {product.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleOpenEditMode(product)}
                                                        className="h-8 w-8 rounded-lg border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200"
                                                        title="تعديل المنتج"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDelete(product.id)}
                                                        className="h-8 w-8 rounded-lg border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200"
                                                        title="حذف المنتج"
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

                {/* Mobile View (Cards) */}
                <div className="md:hidden flex flex-col gap-3 p-3">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37]" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-gray-500 font-arabic text-center">
                            <Package className="w-12 h-12 text-gray-300 mb-3" />
                            <p>لا توجد منتجات مطابقة لبحثك.</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {products.map((product) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.2 }}
                                    key={product.id}
                                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col gap-4 relative overflow-hidden"
                                >
                                    {product.badge && (
                                        <div className="absolute top-3 left-3">
                                            <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5">{product.badge}</Badge>
                                        </div>
                                    )}
                                    <div className="flex gap-4 items-center">
                                        <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-6 h-6 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col gap-1 justify-center">
                                            <h3 className="font-arabic font-bold text-[#0B281F] truncate text-base">{product.name}</h3>
                                            <div className="flex items-center gap-2 mt-1 w-full flex-wrap">
                                                <span className="font-sans font-medium text-gray-600 text-xs bg-gray-100 px-1.5 py-0.5 rounded" dir="ltr">#{product.code}</span>
                                                <span className="font-sans font-bold text-[#D4AF37] text-sm bg-[#D4AF37]/5 px-2 py-0.5 rounded-md" dir="ltr">{product.price}</span>
                                                {product.isActive ? (
                                                    <Badge className="bg-emerald-100 text-emerald-700 font-arabic border-0 text-[10px] px-1.5 py-0 shadow-none">مفعل</Badge>
                                                ) : (
                                                    <Badge className="bg-rose-100 text-rose-700 font-arabic border-0 text-[10px] px-1.5 py-0 shadow-none">مخفي</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleStatusMutation.mutate({ id: product.id, isActive: !product.isActive })}
                                            className={`h-9 font-arabic text-xs rounded-lg border-gray-200 ${product.isActive ? 'hover:bg-rose-50 text-rose-600 hover:border-rose-200' : 'hover:bg-emerald-50 text-emerald-600 hover:border-emerald-200'}`}
                                            disabled={toggleStatusMutation.isPending}
                                        >
                                            {product.isActive ? <EyeOff className="h-3.5 w-3.5 ml-1.5" /> : <Eye className="h-3.5 w-3.5 ml-1.5" />}
                                            {product.isActive ? "إخفاء" : "إظهار"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleOpenEditMode(product)}
                                            className="h-9 font-arabic text-xs text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg border-gray-200"
                                        >
                                            <Pencil className="h-3.5 w-3.5 ml-1.5" />
                                            تعديل
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(product.id)}
                                            className="h-9 font-arabic text-xs hover:bg-red-50 text-red-600 hover:border-red-200 rounded-lg border-gray-200"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 ml-1.5" />
                                            حذف
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </Card>

            <AlertDialog open={productToDelete !== null} onOpenChange={(open) => !open && setProductToDelete(null)}>
                <AlertDialogContent dir="rtl" className="font-arabic">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-right">تأكيد الحذف</AlertDialogTitle>
                        <AlertDialogDescription className="text-right">
                            هل أنت متأكد من حذف هذا المنتج نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.
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
