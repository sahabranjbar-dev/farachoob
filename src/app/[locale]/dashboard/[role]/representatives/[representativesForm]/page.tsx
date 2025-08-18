import { notFound } from "next/navigation";
import RepresentativeForm from "../components/RepresentativeForm";
import { prisma } from "@/lib/prisma";

interface IRepresentativeFormPage {
  params?: Promise<{}>;
  searchParams?: Promise<{ pageType: string; id: string }>;
}

const RepresentativeFormPage = async ({
  searchParams,
}: IRepresentativeFormPage) => {
  try {
    const resolvedSearchParams = await searchParams;
    const id = resolvedSearchParams?.id;

    if (id) {
      const representative = await prisma.representative.findUnique({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          mobile: true,
          address: true,
          city: true,
          province: true,
          latitude: true,
          longitude: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!representative) {
        return notFound();
      }

      return (
        <RepresentativeForm
          initialData={{
            id: representative.id,
            firstName: representative.firstName,
            lastName: representative.lastName,
            mobile: representative.mobile || "",
            address: representative.address || "",
            city: representative.city || "",
            province: representative.province || "",
            latitude: representative.latitude || 0,
            longitude: representative.longitude || 0,
          }}
        />
      );
    }

    // اگر id موجود نبود، فرم برای ایجاد جدید نمایش داده می‌شود
    return <RepresentativeForm />;
  } catch (error) {
    console.error("Error in RepresentativeFormPage:", error);
    return (
      <div className="text-red-500 p-4">
        خطایی رخ داده است. لطفاً دوباره تلاش کنید.
      </div>
    );
  }
};

export default RepresentativeFormPage;
