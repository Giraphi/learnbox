import TodoList from "@/app/components/TodoList";
import InstallPrompt from "@/app/components/InstallPrompt";
import ShowOnPWA from "@/app/components/ShowOnPWA";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Learnbox</h1>
      <ShowOnPWA fallback={<InstallPrompt />}>
        <TodoList />
      </ShowOnPWA>
    </div>
  );
}
