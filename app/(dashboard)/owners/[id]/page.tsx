import { OwnerDetailPageContent } from "@/components/OwnerDetailPageContent";

export default async function OwnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OwnerDetailPageContent id={id} />;
}
