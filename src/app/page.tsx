import TargetForm from '../components/TargetForm';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl font-bold text-green-400">
        OpenSight
      </h1>
      <p className="text-zinc-400">
        Passive reconnaissance & attack surface discovery
      </p>
      <TargetForm />
    </main>
  );
}
