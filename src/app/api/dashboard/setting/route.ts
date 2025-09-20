import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/lib/uploadFile";
import { getServerSession, Theme } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userSession = await getServerSession(authOptions);

    if (!userSession?.user.id) {
      return NextResponse.redirect("/auth/login");
    }

    const searchParams = new URL(request.url).searchParams;
    const userId = searchParams.get("id");

    if (!userId)
      return NextResponse.json({ message: "id is required" }, { status: 400 });

    const userInformation = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userInformation)
      return NextResponse.json({ message: "user not found" }, { status: 400 });

    const { password, sessionToken, ...resolvedData } = userInformation;
    return NextResponse.json({ ...resolvedData }, { status: 200 });
  } catch (error) {
    console.error("GET user error:", error);
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userSession = await getServerSession(authOptions);

    if (!userSession?.user.id) {
      return NextResponse.redirect("/auth/login");
    }

    // گرفتن فرم دیتا
    const formData = await request.formData();
    const userId = formData.get("id")?.toString();

    if (!userId) {
      return NextResponse.json({ message: "id is required" }, { status: 400 });
    }

    // گرفتن فیلدها
    const firstName = formData.get("firstName")?.toString();
    const lastName = formData.get("lastName")?.toString();
    const email = formData.get("email")?.toString();
    const mobile = formData.get("mobile")?.toString();
    const location = formData.get("location")?.toString();
    const biography = formData.get("biography")?.toString();
    const birthDate = formData.get("birthDate")?.toString();
    const nationalId = formData.get("nationalId")?.toString();
    const isActive = formData.get("isActive") === "true";
    const isVerified = formData.get("isVerified") === "true";
    const emailNotification = formData.get("emailNotification") === "true";
    const profileVisible = formData.get("profileVisible") === "true";
    const browserNotification = formData.get("browserNotification") === "true";
    const searchVisible = formData.get("searchVisible") === "true";
    const smsNotification = formData.get("smsNotification") === "true";
    const theme = formData.get("theme") as "light" | "dark" | "auto";

    // عکس
    let imageUrl: string | undefined;
    const imageFile = formData.get("image") as unknown as File | null;

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer()); // ← اینجا کار می‌کنه
      imageUrl = await uploadFile(buffer, "user");
    }

    // آپدیت دیتابیس
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        mobile,
        location,
        biography,
        birthDate,
        nationalId,
        isActive,
        isVerified,
        emailNotification,
        browserNotification,
        profileVisible,
        searchVisible,
        smsNotification,
        theme: {
          set: theme,
        },
        ...(imageUrl && { image: imageUrl }), // ← فقط وقتی عکس آپلود شده
      },
    });

    const { password, ...resolvedData } = updatedUser;
    return NextResponse.json({ ...resolvedData }, { status: 200 });
  } catch (error: any) {
    console.error("PUT user error:", error);
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}
