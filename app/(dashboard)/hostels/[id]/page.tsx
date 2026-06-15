import { HostelDetailPageContent } from "@/components/HostelDetailPageContent";

export default async function HostelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HostelDetailPageContent id={id} />;
}
