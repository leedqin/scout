import CoachSelection from "../components/CoachSelection";

export default function SelectCoachesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-center p-6">
      <CoachSelection showCoaches={true} />
    </main>
  );
}
