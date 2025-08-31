// Refactored Product Form with Enhanced UI
"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { X, Upload, Image as ImageIcon, CheckIcon } from "lucide-react";

import useTabular from "@/hooks/useTabular";
import useDataGetter from "@/hooks/useDataGetter";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Types
interface FormValues {
  id?: string;
  farsiTitle: string;
  englishTitle: string;
  price?: string | number;
  brandId?: string;
  categoryId?: string;
  stock?: number;
  image?: File | string | null;
  description?: string;
}

interface Props {
  initialData?: Partial<FormValues>;
}

const ProductsForm = ({ initialData }: Props) => {
  const id = initialData?.id;
  const { closeCurrentTab, open } = useTabular();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productLoading, setProdcutLoading] = useState<boolean>(false);
  const form = useForm<FormValues>({
    defaultValues: {
      farsiTitle: "",
      englishTitle: "",
      price: "",
      brandId: "",
      categoryId: "",
      stock: 0,
      image: null,
      description: "",
      ...initialData,
    },
  });

  const {
    data: brandsData,
    fetch: fetchBrands,
    loading: brandsLoading,
  } = useDataGetter({
    url: "/dashboard/brands",
    immediatelyFetch: Boolean(initialData?.brandId),
  });

  const {
    data: categoriesData,
    fetch: fetchCategories,
    loading: categoriesLoading,
  } = useDataGetter({
    url: "/dashboard/categories",
    immediatelyFetch: Boolean(initialData?.categoryId),
  });

  const handleImageChange = useCallback(
    (file: File | null, onChange: (val: any) => void) => {
      onChange(file);
      if (file) {
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
      } else {
        setImagePreview(null);
      }
    },
    []
  );

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    if (data.image && typeof data.image !== "string") {
      formData.append("image", data.image);
    }
    formData.append("farsiTitle", data.farsiTitle);
    formData.append("englishTitle", data.englishTitle);
    formData.append("price", String(data.price).replace(/,/g, ""));
    formData.append("brandId", data.brandId ?? "");
    formData.append("categoryId", data.categoryId ?? "");
    formData.append("description", data.description ?? "");
    formData.append("stock", String(data.stock ?? 0));

    try {
      setProdcutLoading(true);
      const response = await axios({
        url: "/api/dashboard/products",
        method: id ? "PUT" : "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const product = response.data;
      if (product?.id) closeCurrentTab();
      open("/products/productsForm", `فرم ویرایش ${product.farsiTitle}`, {
        pageType: "EDIT",
        id: product.id,
      });

      toast.success(
        `محصول ${product.farsiTitle} با موفقیت ${id ? "ویرایش" : "ایجاد"} شد`
      );
    } catch (error: any) {
      toast.error(error.message || "خطا در ارسال فرم");
    } finally {
      setProdcutLoading(false);
    }
  };

  const imageUrl = form.getValues("image");
  const isImageUrl = typeof imageUrl === "string" && imageUrl.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          فرم {id ? "ویرایش" : "ایجاد"} محصول
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["farsiTitle", "englishTitle"].map((name, i) => (
                <FormField
                  key={i}
                  control={form.control}
                  name={name as keyof FormValues}
                  rules={{
                    required: `فیلد ${
                      name === "farsiTitle" ? "نام فارسی" : "نام انگلیسی"
                    } الزامی است.`,
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        {name === "farsiTitle" ? "نام فارسی" : "نام انگلیسی"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-gray-50"
                          value={
                            field.value === null ||
                            typeof field.value === "object"
                              ? ""
                              : field.value
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">قیمت (تومان)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-gray-50"
                        {...field}
                        value={
                          field.value !== null && field.value !== undefined
                            ? field.value.toLocaleString("fa")
                            : ""
                        }
                        onChange={(e) => {
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

              {[
                {
                  name: "brandId",
                  label: "برند",
                  data: brandsData,
                  loading: brandsLoading,
                  fetch: fetchBrands,
                },
                {
                  name: "categoryId",
                  label: "دسته‌بندی",
                  data: categoriesData,
                  loading: categoriesLoading,
                  fetch: fetchCategories,
                },
              ].map(({ name, label, data, loading, fetch }, i) => (
                <FormField
                  key={i}
                  control={form.control}
                  name={name as keyof FormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">{label}</FormLabel>
                      <FormControl>
                        <Select
                          value={
                            typeof field.value === "string"
                              ? field.value
                              : field.value !== undefined &&
                                field.value !== null
                              ? String(field.value)
                              : undefined
                          }
                          onValueChange={field.onChange}
                          onOpenChange={() =>
                            !data?.resultList?.length && fetch?.({})
                          }
                        >
                          <SelectTrigger className="bg-gray-50 w-full">
                            <SelectValue placeholder={`انتخاب ${label}`} />
                          </SelectTrigger>
                          <SelectContent className="min-h-40">
                            {loading ? (
                              <Spinner />
                            ) : (
                              data?.resultList?.map((item: any) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.farsiTitle}
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
              ))}

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">موجودی</FormLabel>
                    <FormControl>
                      <Input type="number" className="bg-gray-50" {...field} />
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
                    <FormLabel className="font-medium">توضیحات</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-gray-50 min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-3">
                    <FormLabel className="font-medium">تصویر محصول</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="text-sm text-gray-500">
                              تصویر را اینجا رها کنید یا کلیک کنید
                            </p>
                          </div>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageChange(
                                e.target.files?.[0] ?? null,
                                field.onChange
                              )
                            }
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(imagePreview || isImageUrl) && (
                <div className="col-span-1 md:col-span-3">
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="پیش‌نمایش تصویر"
                          fill
                          className="object-cover"
                        />
                      ) : isImageUrl ? (
                        <Image
                          src={imageUrl as string}
                          alt="تصویر محصول"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        form.setValue("image", null);
                        setImagePreview(null);
                      }}
                    >
                      حذف تصویر
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="px-8"
                disabled={productLoading}
                left={<CheckIcon />}
              >
                {productLoading ? (
                  <div className="flex justify-center items-center">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-orange-600 fill-orange-400"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  "ذخیره"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                left={<X className="w-5 h-5" />}
                onClick={closeCurrentTab}
              >
                بستن
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductsForm;
