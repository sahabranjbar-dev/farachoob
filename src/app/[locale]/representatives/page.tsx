import React from "react";
import RepresentativesPage from "./components/RepresentativesPage";

const page = async () => {
  const representatives = await prisma?.representative.findMany({
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
    },
  });

  return (
    <div>
      <RepresentativesPage
        representatives={(representatives ?? []).map((rep) => ({
          ...rep,
          id: rep.id || "",
          mobile: rep.mobile || "",
          address: rep.address || "",
          city: rep.city || "",
          province: rep.province || "",
          latitude:
            typeof rep.latitude === "number"
              ? rep.latitude
              : rep.latitude
              ? Number(rep.latitude)
              : undefined,
          longitude:
            typeof rep.longitude === "number"
              ? rep.longitude
              : rep.longitude
              ? Number(rep.longitude)
              : undefined,
        }))}
      />
    </div>
  );
};

export default page;
