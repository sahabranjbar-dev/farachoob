"use client";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  CalendarDays as CalendarDaysIcon,
  Clock as ClockIcon,
  Search as SearchIcon,
  ArrowRight as ArrowRightIcon,
  BookOpen as BookOpenIcon,
  Home as HomeIcon,
  Briefcase as BriefcaseIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const Blogs = () => {
  // نمونه محتوای اختصاصی برای شرکت مبلمان اداری
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "۱۰ نکته برای طراحی محیط کار ارگونومیک",
      excerpt:
        "چگونه با انتخاب میز و صندلی مناسب سلامت کارمندان را تضمین کنیم؟",
      slug: "ergonomic-office-design",
      date: "1402/06/20",
      readTime: "7 دقیقه",
      category: "طراحی محیط کار",
      image: "/desk.jpg",
    },
    {
      id: "2",
      title: "ترندهای ۲۰۲۳ در طراحی مبلمان اداری",
      excerpt:
        "آشنایی با جدیدترین سبک‌ها و مواد اولیه در تولید میز و صندلی اداری",
      slug: "office-furniture-trends",
      date: "1402/05/15",
      readTime: "9 دقیقه",
      category: "ترندها",
      image: "/desk.jpg",
    },
    {
      id: "3",
      title: "چوب در مقابل فلز: کدام برای میز کار بهتر است؟",
      excerpt: "مقایسه مزایا و معایب مواد مختلف در تولید مبلمان اداری",
      slug: "wood-vs-metal",
      date: "1402/04/30",
      readTime: "11 دقیقه",
      category: "مواد اولیه",
      image: "/desk.jpg",
    },
    {
      id: "4",
      title: "راهنمای انتخاب صندلی اداری مناسب",
      excerpt: "معیارهای مهم در انتخاب صندلی اداری برای ساعت‌های طولانی کار",
      slug: "choosing-office-chair",
      date: "1402/04/10",
      readTime: "8 دقیقه",
      category: "مبلمان اداری",
      image: "/desk.jpg",
    },
  ];

  const categories = [
    { name: "همه", icon: <HomeIcon size={16} />, count: blogPosts.length },
    {
      name: "طراحی محیط کار",
      icon: <BriefcaseIcon size={16} />,
      count: blogPosts.filter((post) => post.category === "طراحی محیط کار")
        .length,
    },
    {
      name: "ترندها",
      icon: <BookOpenIcon size={16} />,
      count: blogPosts.filter((post) => post.category === "ترندها").length,
    },
  ];

  return (
    <>
      <Head>
        <title>بلاگ تخصصی مبلمان اداری | شرکت شما</title>
        <meta
          name="description"
          content="مقالات تخصصی درباره طراحی محیط کار و مبلمان اداری"
        />
      </Head>

      {/* هیرو بخش */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4"
          >
            دانش تخصصی مبلمان اداری
          </motion.h1>
          <p className="text-xl max-w-2xl mx-auto">
            جدیدترین مقالات و راهنمای‌های تخصصی در زمینه طراحی محیط کار و انتخاب
            مبلمان اداری
          </p>
        </div>
      </div>

      {/* بخش اصلی */}
      <div className="container mx-auto px-4 py-12">
        {/* جستجو و فیلترها */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در مقالات..."
              className="w-full pr-4 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                {category.icon}
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">
                  ({category.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* لیست مقالات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <CalendarDaysIcon size={14} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <ClockIcon size={14} />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  مطالعه مقاله
                  <ArrowRightIcon size={16} className="mr-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* پینوشت */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">
            دانش تخصصی برای محیط‌های کاری بهتر
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            در بلاگ تخصصی شرکت ما، شما با جدیدترین استانداردهای طراحی محیط کار،
            ارگونومی مبلمان اداری و راهکارهای بهینه‌سازی فضای کاری آشنا می‌شوید.
          </p>
        </div>
      </div>
    </>
  );
};

// تابع برای تولید صفحات استاتیک
// export async function getStaticProps() {
//   // در آینده می‌توانید داده‌ها را از CMS یا API دریافت کنید
//   return {
//     props: {}, // داده‌ها از طریق props به کامپوننت منتقل می‌شوند
//     revalidate: 3600, // ISR: هر 1 ساعت صفحه را مجدداً می‌سازد
//   };
// }

export default Blogs;
