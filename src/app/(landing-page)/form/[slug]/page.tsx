import PublicDynamicForm from "@/features/forms/PublicDynamicForm";
import { formService } from "@/services/formService";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DynamicFormPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DynamicFormPageProps): Promise<Metadata> {
  const { slug } = await params;
  const form = await formService.getFormBySlugOrId(slug);

  if (!form) {
    return {
      title: "Formulir Tidak Ditemukan",
      description: "Formulir yang Anda cari tidak ditemukan atau sudah ditutup.",
    };
  }

  const plainDesc = form.description || "Formulir pendaftaran dan pendataan PMK Daniel FILKOM Universitas Brawijaya.";
  const truncatedDesc = plainDesc.length > 160 ? plainDesc.substring(0, 157) + "..." : plainDesc;

  return {
    title: form.title,
    description: truncatedDesc,
    openGraph: {
      title: `${form.title} | PMK Daniel FILKOM UB`,
      description: truncatedDesc,
      url: `https://pmkdaniel.site/form/${form.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${form.title} | PMK Daniel FILKOM UB`,
      description: truncatedDesc,
    },
  };
}

export default async function DynamicFormPage({ params }: DynamicFormPageProps) {
  const { slug } = await params;
  return <PublicDynamicForm slug={slug} />;
}
