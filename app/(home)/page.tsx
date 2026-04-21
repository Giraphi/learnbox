import PractiseView from "@/app/(home)/components/PractiseView/PractiseView";
import ShaderBackground from "@/app/(home)/components/ShaderBackground";

export default function PractisePage() {
  return (
    <>
      <ShaderBackground />
      <div className="flex flex-1 flex-col items-center px-4 pt-12">
        <PractiseView />
      </div>
    </>
  );
}
