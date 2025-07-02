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
import useTabular from "@/hooks/useTabular";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  id: string;
  farsiTitle: string;
  englishTitle: string;
  price: number | string | null;
  brandId?: string;
  categoryId?: string;
  stock?: number;
  image?: File | null;
  description?: string;
  colors?: string[];
  comments?: string[];
};

interface Props {
  initialData?: Partial<FormValues> & { id?: string };
}

const ProductsForm = ({ initialData }: Props) => {
  const id = initialData?.id;

  const { closeCurrentTab, open } = useTabular();

  //   const {
  //     data,
  //     error,
  //     fetch,
  //     loading: submitLoading,
  //   } = useDataGetter({
  //     url: id ? `/dashboard/products/${id}` : "/dashboard/products",
  //     method: id ? "PUT" : "POST",
  //     immediatelyFetch: false,
  //   });

  // فرض می‌کنیم برند و دسته‌بندی‌ها رو جداگانه از API می‌گیریم
  const {
    data: brandsData,
    fetch: fetchBrands,
    loading: brandsLoading,
    error: brandsError,
  } = useDataGetter({
    url: "dashboard/brands",
    immediatelyFetch: !!id,
  });
  const {
    data: categoriesData,
    fetch: fetchCategories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useDataGetter({
    url: "dashboard/categories",
    immediatelyFetch: !!id,
  });

  const form = useForm<FormValues>({
    defaultValues: {
      farsiTitle: "",
      englishTitle: "",
      price: null,
      brandId: "",
      categoryId: "",
      stock: 0,
      image: null,
      description: "",
      colors: [],
      comments: [],
      ...initialData,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    if (data.image) {
      formData.append("image", data.image); // فایل انتخاب‌شده
    }
    formData.append("farsiTitle", data.farsiTitle);
    formData.append("englishTitle", data?.englishTitle);
    formData.append("price", String(data.price).replace(/,/g, ""));
    formData.append("brandId", data?.brandId ?? "");
    formData.append("categoryId", data?.categoryId ?? "");
    formData.append("description", data?.description ?? "");
    // formData.append("colors",data?.colors ?? "");
    formData.append("stock", String(data?.stock));

    await fetch?.(
      id ? `/api/dashboard/products/${id}` : "/api/dashboard/products",
      {
        method: id ? "PUT" : "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          closeCurrentTab();
          open("/products/productsForm", `فرم ویرایش ${data?.farsiTitle}`, {
            pageType: "EDIT",
            id: data?.id,
          });
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <Card className="relative">
      {/* {submitLoading && (
        <div className="backdrop-brightness-75 z-50 w-full h-full flex justify-center items-center absolute top-0 right-0 rounded">
          <Spinner />
        </div>
      )} */}
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
                      <Input
                        type="text"
                        {...field}
                        value={
                          field.value !== null && field.value !== undefined
                            ? field.value.toLocaleString("fa")
                            : ""
                        }
                        placeholder="قیمت محصول را وارد کنید"
                        onChange={(e) => {
                          // field.onChange();
                          field.onChange(
                            e.target.value
                              .replace(/[٬,]/g, "")
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brandId"
                rules={{ required: "انتخاب برند الزامی است." }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>برند</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        onOpenChange={() => {
                          if (!brandsData?.resultList?.length) {
                            fetchBrands?.({});
                          }
                        }}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="انتخاب برند" />
                        </SelectTrigger>
                        <SelectContent className="min-h-36 overflow-y-auto">
                          {brandsLoading ? (
                            <Spinner />
                          ) : brandsError ? (
                            <div>مشکلی پیش آمده</div>
                          ) : (
                            brandsData?.resultList?.map((brand: any) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.farsiTitle}
                              </SelectItem>
                            ))
                          )}
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
                rules={{ required: "انتخاب دسته‌بندی الزامی است." }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>دسته‌بندی</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        onOpenChange={() => {
                          if (!categoriesData?.resultList?.length) {
                            fetchCategories?.({});
                          }
                        }}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="انتخاب دسته‌بندی" />
                        </SelectTrigger>
                        <SelectContent className="min-h-36 overflow-y-auto">
                          {categoriesLoading ? (
                            <Spinner />
                          ) : categoriesError ? (
                            <div>مشکلی پیش آمده است</div>
                          ) : (
                            categoriesData?.resultList?.map((cat: any) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.farsiTitle}
                              </SelectItem>
                            ))
                          )}
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
                // left={submitLoading ? <Spinner /> : <Check />}
                // disabled={submitLoading}
                type="submit"
                variant="primary"
              >
                ذخیره
              </Button>
              <Button variant="outline" left={<X />} onClick={closeCurrentTab}>
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

export default ProductsForm;
