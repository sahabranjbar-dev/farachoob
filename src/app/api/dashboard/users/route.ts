// /app/api/users/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { normalizePhoneNumber } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // گرفتن فیلترها
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

    // ساختن فیلترها
    const filters: any = {
      AND: [
        name
          ? {
              OR: [
                { firstName: { contains: name } },
                { lastName: { contains: name } },
              ],
            }
          : {},
        email ? { email: { contains: email } } : {},
        role ? { roleId: Number(role) } : {}, // ✅ چون هر کاربر یه role داره
        from ? { createdAt: { gte: new Date(from) } } : {},
        to ? { createdAt: { lte: new Date(to) } } : {},
      ],
    };

    // گرفتن تعداد کل
    const totalItems = await prisma.user.count({ where: filters });

    // گرفتن دیتا
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
                    title: true,
                    permissionKey: true,
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
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      fullName: [user.firstName, user.lastName].filter(Boolean).join(" "),
      email: user.email,
      createdAt: user.createdAt,
      mobile: user.mobile,
      image: user.image,
      role: user?.role,
      roleFarsiTitle: user.role ? user.role.farsiTitle : null,
      permissions: user.role
        ? user.role.permissions.map((item) => item.permission.title)
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
    console.error("❌ Error in GET /dashboard/user:", error);
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

    // بررسی یکتایی فیلدها
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail)
        return NextResponse.json(
          { message: "ایمیل قبلاً ثبت شده است." },
          { status: 400 }
        );
    }

    const normalizedMobile = mobile ? normalizePhoneNumber(mobile) : null;

    if (normalizedMobile) {
      const existingMobile = await prisma.user.findUnique({
        where: { mobile: normalizedMobile },
      });
      if (existingMobile)
        return NextResponse.json(
          { message: "شماره موبایل قبلاً ثبت شده است." },
          { status: 400 }
        );
    }

    if (nationalId) {
      const existingNationalId = await prisma.user.findUnique({
        where: { nationalId },
      });
      if (existingNationalId)
        return NextResponse.json(
          { message: "کد ملی قبلاً ثبت شده است." },
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
        mobile: normalizedMobile,
        image,
        nationalId,
        role: { connect: { id: roleId } },
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error(error);
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

    // بررسی یکتایی فیلدها قبل از آپدیت (به جز کاربر فعلی)
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email, NOT: { id } },
      });
      if (existingEmail)
        return NextResponse.json(
          { message: "ایمیل قبلاً ثبت شده است." },
          { status: 400 }
        );
    }
    const normalizedMobile = mobile ? normalizePhoneNumber(mobile) : null;

    if (normalizedMobile) {
      const existingMobile = await prisma.user.findUnique({
        where: { mobile: normalizedMobile },
      });
      if (existingMobile)
        return NextResponse.json(
          { message: "شماره موبایل قبلاً ثبت شده است." },
          { status: 400 }
        );
    }

    if (nationalId) {
      const existingNationalId = await prisma.user.findFirst({
        where: { nationalId, NOT: { id } },
      });
      if (existingNationalId)
        return NextResponse.json(
          { message: "کد ملی قبلاً ثبت شده است." },
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
        mobile: normalizedMobile,
        image,
        nationalId,
        role: { connect: { id: roleId } },
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
