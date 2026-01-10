import type { Metadata } from "next"

interface ArticleMetadataProps {
  title: string
  description: string
  image: string
  url: string
  publishedTime: string
  modifiedTime?: string
  author: string
  category: string
}

export function generateArticleMetadata({
  title,
  description,
  image,
  url,
  publishedTime,
  modifiedTime,
  author,
  category,
}: ArticleMetadataProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noticiasdelinterior.com.ar"
  const fullUrl = `${siteUrl}${url}`
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`

  return {
    title: `${title} | Noticias del Interior`,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Noticias del Interior",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "es_AR",
      type: "article",
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: [author],
      section: category,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@noticiasdelinterior",
      site: "@noticiasdelinterior",
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}

export function generateArticleJSONLD({
  title,
  description,
  image,
  url,
  publishedTime,
  modifiedTime,
  author,
  category,
}: ArticleMetadataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://noticiasdelinterior.com.ar"
  const fullUrl = `${siteUrl}${url}`
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    image: [imageUrl],
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Noticias del Interior",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    articleSection: category,
    inLanguage: "es-AR",
  }
}
