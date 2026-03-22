import PracticeCard from "@/app/(home)/components/PracticeCard";

export default function PractisePage() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Practise</h1>
      <PracticeCard />
    </div>
  );
}
