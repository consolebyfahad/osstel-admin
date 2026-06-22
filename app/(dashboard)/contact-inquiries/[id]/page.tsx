import { ContactInquiryDetailPageContent } from "@/components/ContactInquiryDetailPageContent";

export default async function ContactInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ContactInquiryDetailPageContent id={id} />;
}
