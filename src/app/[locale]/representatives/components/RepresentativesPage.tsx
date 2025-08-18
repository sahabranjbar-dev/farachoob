"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Phone, Search } from "lucide-react";
import Head from "next/head";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Fix for default marker icons in Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x-black.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

interface Representative {
  id?: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  address?: string;
  city?: string;
  province?: string;
  latitude?: number;
  longitude?: number;
}

const RepresentativesPage = ({
  representatives,
}: {
  representatives: Representative[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("همه");
  const [activeRep, setActiveRep] = useState<number | null>(null);

  // لیست شهرهای منحصر به فرد برای فیلتر
  const cities = ["همه", ...new Set(representatives.map((rep) => rep.city))];

  // فیلتر کردن نمایندگان بر اساس جستجو و شهر
  const filteredRepresentatives = representatives.filter((rep) => {
    const matchesSearch =
      `${rep.firstName} ${rep.lastName} ${rep.mobile} ${rep.address} ${rep.city}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === "همه" || rep.city === selectedCity;

    return matchesSearch && matchesCity;
  });

  // موقعیت مرکزی برای نقشه
  const centerPosition: [number, number] = activeRep
    ? [
        representatives.find((rep) => Number(rep?.id) === activeRep)
          ?.latitude || 35.6892,
        representatives.find((rep) => Number(rep.id) === activeRep)
          ?.longitude || 51.389,
      ]
    : [32.6546, 51.668]; // موقعیت پیشفرض (اصفهان)

  return (
    <>
      <Head>
        <title>لیست نمایندگان | نام شرکت</title>
        <meta
          name="description"
          content="لیست نمایندگان رسمی شرکت در سراسر کشور"
        />
      </Head>

      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-2">
            نمایندگان رسمی ما
          </h1>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            شما می‌توانید نزدیک‌ترین نماینده به خود را پیدا کرده و با آنها تماس
            بگیرید
          </p>

          {/* بخش جستجو و فیلتر */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام، شهر یا آدرس..."
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* بخش اصلی محتوا */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* لیست نمایندگان */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-lg">
                    {filteredRepresentatives.length} نماینده یافت شد
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {filteredRepresentatives.length > 0 ? (
                    filteredRepresentatives.map((rep) => (
                      <div
                        key={rep.id}
                        className={`p-4 hover:bg-blue-50 cursor-pointer transition-colors ${
                          activeRep === Number(rep.id)
                            ? "bg-blue-50 border-r-4 border-blue-500"
                            : ""
                        }`}
                        onClick={() =>
                          setActiveRep(rep?.id ? Number(rep.id) : null)
                        }
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">
                              {rep.firstName} {rep.lastName}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {rep.city} - {rep.province}
                            </p>
                          </div>
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:${rep.mobile}`;
                            }}
                          >
                            <Phone className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="text-gray-700 mt-2 text-sm">
                          <MapPin className="inline h-4 w-4 text-gray-500 mr-1" />
                          {rep.address}
                        </p>
                        <p className="text-blue-600 mt-2">
                          <Phone className="inline h-4 w-4 mr-1" />
                          {rep.mobile}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      نماینده‌ای با این مشخصات یافت نشد
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* نقشه */}
            <div className="lg:w-2/3 h-[600px] rounded-lg shadow overflow-hidden z-1">
              <MapContainer
                center={centerPosition}
                zoom={activeRep ? 15 : 6}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredRepresentatives
                  .filter(
                    (rep) =>
                      typeof rep.latitude === "number" &&
                      typeof rep.longitude === "number"
                  )
                  .map((rep) => (
                    <Marker
                      key={rep.id}
                      position={[
                        rep.latitude as number,
                        rep.longitude as number,
                      ]}
                      eventHandlers={{
                        click: () =>
                          setActiveRep(rep.id ? Number(rep.id) : null),
                      }}
                    >
                      <Popup>
                        <div className="font-bold">
                          {rep.firstName} {rep.lastName}
                        </div>
                        <div className="text-sm">{rep.address}</div>
                        <div className="text-blue-600 mt-1">{rep.mobile}</div>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RepresentativesPage;
