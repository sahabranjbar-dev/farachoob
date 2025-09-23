import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/uploadFile";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (requst: NextRequest) => {
  try {
    const { searchParams } = new URL(requst.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "9", 10);

    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: "صفحه نامعتبر است." }, { status: 400 });
    }

    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: "pageSize نامعتبر است." },
        { status: 400 }
      );
    }

    const skip = (page - 1) * pageSize;

    const [projects, totalItems] = await Promise.all([
      prisma.project.findMany({
        skip,
        take: pageSize,
      }),
      prisma.project.count(),
    ]);

    const resultList = projects.map((item, index) => ({
      ...item,
      rowNumber: skip + index + 1,
    }));

    return NextResponse.json({
      resultList,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "خطایی در سرور رخ داده است",
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (requst: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({
        message: "دسترسی ندارید",
      });
    }
    const user = session?.user;
    const formData = await requst.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const files = formData.getAll("images") as File[];
    const uploadedUrls: string[] = [];

    for (const item of files) {
      if (
        item instanceof File &&
        item.size > 0 &&
        item.type.startsWith("image/")
      ) {
        const url = await uploadFile(item, "projects");
        uploadedUrls.push(url);
      }
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        images: uploadedUrls,
        userId: user?.id,
        authorId: user?.id,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "خطایی در سرور رخ داده است",
        error,
      },
      {
        status: 500,
      }
    );
  }
};

// ویرایش پروژه موجود
export const PUT = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "دسترسی ندارید" }, { status: 403 });

    const user = session.user;
    const formData = await request.formData();

    const projectId = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const files = formData.getAll("images") as (File | string)[];
    const uploadedUrls: string[] = [];

    // آپلود فایل‌های جدید و حفظ URLهای قدیمی
    for (const item of files) {
      if (
        item instanceof File &&
        item.size > 0 &&
        item.type.startsWith("image/")
      ) {
        const url = await uploadFile(item, "projects");
        uploadedUrls.push(url);
      } else if (typeof item === "string") {
        uploadedUrls.push(item);
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        description,
        images: uploadedUrls,
        authorId: user.id,
      },
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "خطایی در سرور رخ داده است", error },
      { status: 500 }
    );
  }
};
