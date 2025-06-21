"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MultiSelect } from "./MultiSelect";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { Funnel, XCircle, ChevronsUpDown, Search } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onFilterChange: (filters: Record<string, string>) => void;
  roleOptions: { value: string; label: string }[];
  isOpen: boolean;
  fetchRoles: () => void;
}

interface FilterValues {
  name: string;
  email: string;
  roles: string[];
  from: Date | null;
  to: Date | null;
}

export default function UserFilter({
  onFilterChange,
  roleOptions,
  isOpen,
  fetchRoles,
}: Props) {
  const { register, handleSubmit, control, reset, watch } =
    useForm<FilterValues>({
      defaultValues: {
        name: "",
        email: "",
        roles: [],
        from: null,
        to: null,
      },
    });

  const onSubmit = (data: FilterValues) => {
    const filters: Record<string, string> = {};
    if (data.name) filters.name = data.name;
    if (data.email) filters.email = data.email;
    if (data.roles.length) filters.role = data.roles[0];
    if (data.from) filters.from = data.from.toISOString();
    if (data.to) filters.to = data.to.toISOString();

    onFilterChange(filters);
  };

  const handleReset = () => {
    reset();
    onFilterChange({});
  };

  useEffect(() => {
    fetchRoles();
  }, []);
  return (
    <div className="bg-muted/50">
      <AnimatePresence>
        {isOpen && (
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-6 gap-4 items-center p-4">
              <Input
                placeholder="جستجو نام"
                {...register("name")}
                className="bg-white"
              />

              <Input
                placeholder="جستجو ایمیل"
                {...register("email")}
                className="bg-white"
              />
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={roleOptions}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="انتخاب نقش"
                    animation={0.5}
                    variant="inverted"
                    className="bg-white"
                  />
                )}
              />

              <Controller
                name="from"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        {field.value
                          ? format(field.value, "yyyy/MM/dd", { locale: faIR })
                          : "از تاریخ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />

              <Controller
                name="to"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        {field.value
                          ? format(field.value, "yyyy/MM/dd", { locale: faIR })
                          : "تا تاریخ"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />

              <div className="flex justify-start items-center gap-2">
                <Button
                  variant="ghost"
                  type="submit"
                  className="flex items-center gap-1 bg-blue-500 text-white hover:bg-blue-300"
                  tooltip="جستجو"
                >
                  <Search size="36" />
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="flex items-center gap-1 bg-red-500 text-white hover:bg-red-300"
                  tooltip="حذف فیلتر"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
