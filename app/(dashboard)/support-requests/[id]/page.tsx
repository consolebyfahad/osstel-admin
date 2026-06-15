import { SupportRequestDetailPageContent } from "@/components/SupportRequestDetailPageContent";

export default async function SupportRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SupportRequestDetailPageContent id={id} />;
}
