"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
} from "lucide-react";

// تابع تبدیل تاریخ میلادی به شمسی
const gregorianToJalali = (gy: any, gm: any, gd: any) => {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    parseInt(((gy2 + 3) / 4) as any) -
    parseInt(((gy2 + 99) / 100) as any) +
    parseInt(((gy2 + 399) / 400) as any) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * parseInt((days / 12053) as any);
  days %= 12053;
  jy += 4 * parseInt((days / 1461) as any);
  days %= 1461;
  jy += parseInt(((days - 1) / 365) as any);
  if (days > 365) days = (days - 1) % 365;
  let jm =
    days < 186
      ? 1 + parseInt((days / 31) as any)
      : 7 + parseInt(((days - 186) / 30) as any);
  let jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
};

// تابع تبدیل تاریخ شمسی به میلادی
const jalaliToGregorian = (jy: any, jm: any, jd: any) => {
  jy += 1595;
  let days =
    -355668 +
    365 * jy +
    parseInt((jy / 33) as any) * 8 +
    parseInt((((jy % 33) + 3) / 4) as any) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  let gy = 400 * parseInt((days / 146097) as any);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * parseInt((--days / 36524) as any);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * parseInt((days / 1461) as any);
  days %= 1461;
  if (days > 365) {
    gy += parseInt(((days - 1) / 365) as any);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const sal_a = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm;
  for (gm = 0; gm < 13; gm++) {
    let v = sal_a[gm];
    if (gd <= v) break;
    gd -= v;
  }
  return [gy, gm, gd];
};

// نام ماه‌های شمسی
const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

// نام روزهای هفته
const persianWeekdays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

// نام کامل روزهای هفته
const persianWeekdaysFull = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

interface PersianCalendarProps {
  onDateSelect?: (date: string) => void;
  selectedDate?: string; // فرمت: YYYY/MM/DD
  events?: { date: string; title: string; color?: string }[]; // رویدادها
  showTodayButton?: boolean;
  className?: string;
}

const PersianCalendar: React.FC<PersianCalendarProps> = ({
  onDateSelect,
  selectedDate,
  events = [],
  showTodayButton = true,
  className = "",
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [jalaliDate, setJalaliDate] = useState<[number, number, number]>([
    1400, 1, 1,
  ]);

  // تبدیل تاریخ فعلی به شمسی
  useEffect(() => {
    const now = new Date();
    const [jy, jm, jd] = gregorianToJalali(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );
    setJalaliDate([jy, jm, jd]);
    setCurrentDate(now);
  }, []);

  // تغییر ماه
  const changeMonth = (direction: "next" | "prev") => {
    const [jy, jm, jd] = jalaliDate;
    let newJy = jy;
    let newJm = jm;

    if (direction === "next") {
      if (jm === 12) {
        newJy = jy + 1;
        newJm = 1;
      } else {
        newJm = jm + 1;
      }
    } else {
      if (jm === 1) {
        newJy = jy - 1;
        newJm = 12;
      } else {
        newJm = jm - 1;
      }
    }

    const newJalaliDate: [number, number, number] = [newJy, newJm, 1];
    setJalaliDate(newJalaliDate);

    // تبدیل به میلادی برای بروزرسانی currentDate
    const [gy, gm, gd] = jalaliToGregorian(newJy, newJm, 1);
    setCurrentDate(new Date(gy, gm - 1, gd));
  };

  // بازگشت به امروز
  const goToToday = () => {
    const now = new Date();
    const [jy, jm, jd] = gregorianToJalali(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );
    setJalaliDate([jy, jm, jd]);
    setCurrentDate(now);
  };

  // انتخاب تاریخ
  const handleDateSelect = (day: number) => {
    const [jy, jm] = jalaliDate;
    const selectedJalali = `${jy}/${jm.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}`;

    if (onDateSelect) {
      onDateSelect(selectedJalali);
    }
  };

  // تولید روزهای ماه
  const generateCalendarDays = () => {
    const [jy, jm] = jalaliDate;

    // تعیین اولین روز ماه
    const [gy, gm, gd] = jalaliToGregorian(jy, jm, 1);
    const firstDay = new Date(gy, gm - 1, gd).getDay(); // 0-6 (یکشنبه-شنبه)

    // تطبیق با تقویم شمسی (شنبه اولین روز)
    const firstDayPersian = (firstDay + 1) % 7;

    // تعداد روزهای ماه
    const daysInMonth = jm <= 6 ? 31 : jm <= 11 ? 30 : isLeapYear(jy) ? 30 : 29;

    const days = [];

    // روزهای خالی قبل از شروع ماه
    for (let i = 0; i < firstDayPersian; i++) {
      days.push(null);
    }

    // روزهای ماه
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // بررسی سال کبیسه
  const isLeapYear = (year: number) => {
    const leapYears = [1, 5, 9, 13, 17, 22, 26, 30];
    return leapYears.includes(year % 33);
  };

  // بررسی آیا تاریخ امروز است
  const isToday = (day: number) => {
    const [currentJy, currentJm, currentJd] = gregorianToJalali(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    );

    return (
      jalaliDate[0] === currentJy &&
      jalaliDate[1] === currentJm &&
      day === currentJd
    );
  };

  // بررسی آیا تاریخ انتخاب شده است
  const isSelected = (day: number) => {
    if (!selectedDate) return false;

    const [selectedJy, selectedJm, selectedJd] = selectedDate
      .split("/")
      .map(Number);
    return (
      jalaliDate[0] === selectedJy &&
      jalaliDate[1] === selectedJm &&
      day === selectedJd
    );
  };

  // دریافت رویدادهای یک تاریخ خاص
  const getEventsForDate = (day: number) => {
    const dateStr = `${jalaliDate[0]}/${jalaliDate[1]
      .toString()
      .padStart(2, "0")}/${day.toString().padStart(2, "0")}`;
    return events.filter((event) => event.date === dateStr);
  };

  const days = generateCalendarDays();
  const [jy, jm] = jalaliDate;

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-4 ${className}`}>
      {/* هدر تقویم */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="text-blue-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">تقویم شمسی</h2>
        </div>

        <div className="flex items-center gap-2">
          {showTodayButton && (
            <button
              onClick={goToToday}
              className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-md hover:bg-blue-200 transition-colors"
            >
              امروز
            </button>
          )}

          <div className="flex gap-1">
            <button
              onClick={() => changeMonth("prev")}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => changeMonth("next")}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* نمایش ماه و سال */}
      <div className="text-center mb-4">
        <span className="text-xl font-bold text-gray-800">
          {persianMonths[jm - 1]} {jy}
        </span>
      </div>

      {/* روزهای هفته */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {persianWeekdays.map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-medium text-gray-500 py-2"
            title={persianWeekdaysFull[index]}
          >
            {day}
          </div>
        ))}
      </div>

      {/* روزهای ماه */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="p-2"></div>;
          }

          const dateEvents = getEventsForDate(day);
          const today = isToday(day);
          const selected = isSelected(day);

          return (
            <div
              key={index}
              onClick={() => handleDateSelect(day)}
              className={`
                relative p-2 text-center rounded-md cursor-pointer transition-all
                ${today ? "bg-blue-100 text-blue-700 font-semibold" : ""}
                ${selected ? "bg-blue-500 text-white font-semibold" : ""}
                ${!today && !selected ? "hover:bg-gray-100" : ""}
                flex flex-col items-center justify-center min-h-[60px]
              `}
            >
              <span className="text-sm">{day}</span>

              {/* نمایش رویدادها */}
              {dateEvents.length > 0 && (
                <div className="flex justify-center mt-1 gap-1">
                  {dateEvents.slice(0, 2).map((event, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: event.color || "#3B82F6" }}
                      title={event.title}
                    />
                  ))}
                  {dateEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dateEvents.length - 2}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* راهنمای رویدادها */}
      {events.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">رویدادها</h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {events.slice(0, 3).map((event, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: event.color || "#3B82F6" }}
                />
                <span className="text-gray-600">{event.date}</span>
                <span className="truncate">{event.title}</span>
              </div>
            ))}
            {events.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                و {events.length - 3} رویداد دیگر
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianCalendar;
