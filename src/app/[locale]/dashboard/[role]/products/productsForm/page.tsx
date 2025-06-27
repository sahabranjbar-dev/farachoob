"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDataGetter from "@/hooks/useDataGetter";
import useParams from "@/hooks/useParams";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";

type FormValues = {
  id?: string;
  farsiTitle: string;
  englishTitle: string;
  price: number;
  brandId: string;
  categoryId: string;
  stock?: number;
  image?: File | null;
  description?: string;
  colors?: string[];
  comments?: string[];
};

const page = () => {
  const { params, setActiveParam } = useParams<{
    pageType?: string;
    id?: string;
  }>();
  const id = params?.id;

  const { data: formData, loading: formDataLoading } = useDataGetter({
    url: id ? `dashboard/products/${id}` : undefined,
    immediatelyFetch: Boolean(id),
    onSuccess(data) {
      if (data?.id) {
        form.reset({
          id: data.id,
          farsiTitle: data.farsiTitle ?? "",
          englishTitle: data.englishTitle ?? "",
          price: data.price ?? 0,
          brandId: data.brandId ?? "",
          categoryId: data.categoryId ?? "",
          stock: data.stock ?? 0,
          image: null,
          description: data.description ?? "",
          colors: data.colors ?? [],
          comments: data.comments ?? [],
        });
      }
    },
  });

  const {
    data,
    error,
    fetch: POST,
    loading: submitLoading,
  } = useDataGetter({
    url: id ? `dashboard/products/${id}` : "dashboard/products",
    method: id ? "PUT" : "POST",
    immediatelyFetch: false,
  });

  // فرض می‌کنیم برند و دسته‌بندی‌ها رو جداگانه از API می‌گیریم
  const { data: brandsData, fetch: fetchBrands } = useDataGetter({
    url: "dashboard/brands",
    immediatelyFetch: true,
  });
  const { data: categoriesData, fetch: fetchCategories } = useDataGetter({
    url: "dashboard/categories",
    immediatelyFetch: true,
  });

  const form = useForm<FormValues>({
    defaultValues: {
      farsiTitle: "",
      englishTitle: "",
      price: 0,
      brandId: "",
      categoryId: "",
      stock: 0,
      image: null,
      description: "",
      colors: [],
      comments: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    if (data.image) {
      formData.append("image", data.image); // فایل انتخاب‌شده
    }
    formData.append("farsiTitle", data.farsiTitle);
    formData.append("englishTitle", "Test Product");
    formData.append("price", String(data.price));

    await fetch("/api/dashboard/products", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <Card className="relative">
      {formDataLoading && (
        <div className="backdrop-brightness-75 z-50 w-full h-full flex justify-center items-center absolute top-0 right-0 rounded">
          <Spinner />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-center">
          فرم {id ? "ویرایش" : "ایجاد"} محصول
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="farsiTitle"
                rules={{ required: "نام فارسی محصول الزامی است." }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام فارسی</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="مثال: کیک شکلاتی" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="englishTitle"
                rules={{ required: "نام انگلیسی محصول الزامی است." }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام انگلیسی</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Example: Chocolate Cake" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                rules={{
                  required: "قیمت محصول الزامی است.",
                  min: { value: 0, message: "قیمت نمی‌تواند منفی باشد." },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>قیمت (تومان)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="10000" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brandId"
                // rules={{ required: "انتخاب برند الزامی است." }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>برند</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        onOpenChange={() => {
                          if (!brandsData?.resultList?.length) {
                            // fetchBrands?.();
                          }
                        }}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="انتخاب برند" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {brandsData?.resultList?.map((brand: any) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.farsiTitle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                // rules={{ required: "انتخاب دسته‌بندی الزامی است." }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>دسته‌بندی</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        onOpenChange={() => {
                          if (!categoriesData?.resultList?.length) {
                            // fetchCategories?.();
                          }
                        }}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="انتخاب دسته‌بندی" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {categoriesData?.resultList?.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.farsiTitle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>موجودی</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-3">
                    <FormLabel>توضیحات</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* میتونی کامنت‌ها و رنگ‌بندی رو اینجا به دلخواه اضافه کنی */}
            </div>
            <div className="flex justify-end gap-4">
              <Button
                left={submitLoading ? <Spinner /> : <Check />}
                disabled={submitLoading}
                type="submit"
                variant="primary"
              >
                ذخیره
              </Button>
              <Button
                variant="outline"
                left={<X />}
                onClick={() =>
                  setActiveParam({ pageType: undefined, id: undefined })
                }
              >
                انصراف
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default page;
