"use client";

import FullScreenLoading from "@/components/FullScreenLoading";
import LocationPicker from "@/components/LocationPicker";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
import useDataGetter from "@/hooks/useDataGetter";
import useTabular from "@/hooks/useTabular";
import { CheckIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { MapContainer, TileLayer } from "react-leaflet";
import { toast } from "sonner";

type FormValues = {
  firstName: string;
  lastName: string;
  mobile?: string;
  address?: string;
  city?: string;
  province?: string;
  latitude?: number;
  longitude?: number;
};

interface Props {
  initialData?: Partial<FormValues> & { id?: string };
}

export default function RepresentativeForm({ initialData }: Props) {
  const form = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      address: "",
      city: "",
      province: "",
      latitude: 0,
      longitude: 0,
      ...initialData,
    },
  });

  const { closeCurrentTab, open } = useTabular();
  const isCreate = Boolean(initialData?.id);

  const { fetch, loading } = useDataGetter({
    url: "dashboard/representatives",
    method: initialData?.id ? "PUT" : "POST",
    immediatelyFetch: false,
  });

  async function onSubmit(data: FormValues) {
    const payload = initialData?.id ? { id: initialData.id, ...data } : data;

    fetch?.({ inputBody: payload })
      .then((res) => {
        closeCurrentTab();
        toast.success(`نماینده ${data.firstName} ذخیره شد`);
        if (res?.id) {
          open(
            "/representatives/representativeForm",
            `ویرایش نماینده ${data.firstName}`,
            { pageType: "EDIT", id: res.id }
          );
        }
      })
      .catch((err) => toast.error(err.message));
  }

  return (
    <Card className="relative">
      {loading && <FullScreenLoading />}
      <CardHeader>
        <CardTitle className="text-center">
          فرم {!isCreate ? "ویرایش" : "ایجاد"} نماینده
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* اطلاعات شخصی */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              rules={{ required: "نام الزامی است" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="نام نماینده" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              rules={{ required: "نام خانوادگی الزامی است" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام خانوادگی</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="نام خانوادگی نماینده" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              rules={{ required: "شماره تماس الزامی است" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تلفن</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="09123456789" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* آدرس و شهر/استان */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>آدرس</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="آدرس دقیق نماینده" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شهر</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="شهر" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>استان</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="استان" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* طول و عرض جغرافیایی + نقشه */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عرض جغرافیایی</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.0001" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>طول جغرافیایی</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.0001" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3">
            <div className="h-64 w-full rounded-lg shadow overflow-hidden">
              <MapContainer
                key={`${form.getValues("latitude")}-${form.getValues(
                  "longitude"
                )}`}
                center={[
                  form.getValues("latitude") || 35.6892,
                  form.getValues("longitude") || 51.389,
                ]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationPicker
                  onChange={(lat, lng) => {
                    form.setValue("latitude", lat);
                    form.setValue("longitude", lng);
                  }}
                />
              </MapContainer>
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="flex flex-col md:flex-row justify-end gap-4">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              left={<CheckIcon />}
            >
              ذخیره
            </Button>
            <Button variant="outline" onClick={closeCurrentTab} left={<X />}>
              انصراف
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
