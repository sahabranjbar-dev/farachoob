"use client";
import FullScreenLoading from "@/components/FullScreenLoading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import React from "react";
import { useForm } from "react-hook-form";

interface IUserForm {
  initialData?: any;
}

interface FormValues {
  id: string;
  email: string;
  password: string;
  name: string;
  mobile: any;
  image: any;
  roleId: string;
  createdAt: string;
}
const UserForm = ({ initialData }: IUserForm) => {
  const form = useForm<FormValues>({
    defaultValues: {},
  });
  return (
    <Card className="relative">
      {/* {loading ? <FullScreenLoading /> : null} */}
      <CardHeader>
        <CardTitle className="text-center">
          فرم {!initialData.id ? "ویرایش" : "ایجاد"} منو
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div></div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
