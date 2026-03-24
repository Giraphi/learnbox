import VocabularyList from "@/app/box/components/VocabularyList";

export default function BoxPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Vocabulary</h1>
      <VocabularyList />
    </div>
  );
}
