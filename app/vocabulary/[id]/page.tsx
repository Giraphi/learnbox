import VocabularyDetail from "@/app/box/[id]/components/VocabularyDetail";

type VocabularyDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function VocabularyDetailPage({
  params,
}: VocabularyDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-12">
      <VocabularyDetail id={id} />
    </div>
  );
}
