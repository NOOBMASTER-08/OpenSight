export default function ModuleCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800">
      <h2 className="text-green-400 font-semibold mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}
