import Spinner from "@/components/Spinner";

export default function LoadingPage() {
  return (
    <div className="flex h-[80lvh] items-center justify-center">
      <Spinner size={24} />
    </div>
  );
}
