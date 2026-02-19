import { Header } from "@/components/header"
import { CategoryView } from "@/components/category/category-view"
import { fetchApi } from "@/lib/api-client"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function EconomiaPage() {
  const categorySlug = "economia"

  let category;
  let news = [];

  try {
    const catResponse = await fetchApi(`/categories/slug/${categorySlug}`);
    if (catResponse.success) {
      category = catResponse.data;
    }

    if (!category) return notFound();

    const newsResponse = await fetchApi(`/news?categorySlug=${categorySlug}&limit=20`);
    if (newsResponse.success && newsResponse.data?.data) {
      news = newsResponse.data.data;
    }
  } catch (error) {
    console.error("Error fetching category news:", error);
    return notFound();
  }

  return (
    <>
      <Header />
      <CategoryView category={category} initialNews={news} />
    </>
  )
}
