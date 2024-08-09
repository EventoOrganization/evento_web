import { sectionRenderer } from "@/utils/section-renderer";
import { Metadata } from "next";
import { getPageBySlug } from "@/utils/get-page-by-slug";
import { FALLBACK_SEO } from "@/constants";

type Props = {
  params: {
    lang: string;
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getPageBySlug(params.slug, params.lang);
  if (!page.data[0].attributes?.seo) return FALLBACK_SEO;
  const metadata = page.data[0].attributes.seo;

  return {
    title: metadata.metaTitle,
    description: metadata.metaDescription,
  };
}

export default async function PageRoute({ params }: Props) {
  const page = await getPageBySlug(params.slug, params.lang);
  if (page.data.length === 0) return null;

  const contentSections = page.data[0].attributes.contentSections;
  return contentSections.map((section: typeof sectionRenderer, index: number) =>
    sectionRenderer(section, index),
  );
}
