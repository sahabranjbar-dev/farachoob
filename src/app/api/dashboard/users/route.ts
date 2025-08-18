// /app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // فیلترها
    const name = searchParams.get("name") || undefined;
    const email = searchParams.get("email") || undefined;
    const role = searchParams.get("role") || undefined;
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;

    // پجینیشن
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    // سورت
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    // فیلترها
    const filters = {
      AND: [
        name ? { name: { contains: name } } : {},
        email ? { email: { contains: email } } : {},
        role ? { roles: { some: { id: Number(role) } } } : {},
        from ? { createdAt: { gte: new Date(from) } } : {},
        to ? { createdAt: { lte: new Date(to) } } : {},
      ],
    };

    // گرفتن تعداد کل
    const totalItems = await prisma.user.count({ where: filters });

    // گرفتن دیتا با پجینیشن و سورت
    const users = await prisma.user.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        image: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            farsiTitle: true,
            englishTitle: true,
            permissions: {
              select: {
                permission: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const usersData = users.map((user, index) => ({
      rowNumber: (page - 1) * pageSize + index + 1,
      id: user.id,
      name: [user.firstName, user.lastName].filter(Boolean).join(" "),
      email: user.email,
      createdAt: user.createdAt,
      mobile: user.mobile,
      image: user.image,
      role: user.role ? user.role.farsiTitle : null,
      permissions: user.role
        ? user.role.permissions.map((item) => item.permission.name)
        : [],
    }));

    return NextResponse.json({
      resultList: usersData,
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در دریافت کاربران." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      roleId,
      birthDate,
      isActive,
      isVerified,
      mobile,
      image,
      nationalId,
    } = await request.json();

    if (!firstName || !lastName || !email || !password || !roleId) {
      return NextResponse.json(
        { message: "اطلاعات ورودی ناقص است." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        birthDate,
        isActive,
        isVerified,
        mobile,
        image,
        nationalId,
        role: {
          connect: { id: roleId },
        },
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(
      { message: "خطا در ساخت کاربر." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const {
      firstName,
      lastName,
      email,
      roleId,
      id,
      birthDate,
      isActive,
      isVerified,
      mobile,
      image,
      nationalId,
    } = await request.json();

    if (!id || !firstName || !lastName || !email || !roleId) {
      return NextResponse.json(
        { message: "اطلاعات ورودی نامعتبر است." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id },
      data: {
        email,
        firstName,
        lastName,
        birthDate,
        isActive,
        isVerified,
        mobile,
        image,
        nationalId,
        role: {
          connect: { id: roleId },
        },
      },
    });

    return NextResponse.json({ message: "کاربر با موفقیت ویرایش شد" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "خطا در بروزرسانی کاربر." },
      { status: 500 }
    );
  }
}

// حذف کاربر
export async function DELETE(request: Request) {
  try {
    const id = Number(request.body);

    if (!id) {
      return NextResponse.json(
        { message: "شناسه معتبر نیست." },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: String(id) } });

    return NextResponse.json({ message: "کاربر با موفقیت حذف شد." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطا در حذف کاربر." }, { status: 500 });
  }
}
