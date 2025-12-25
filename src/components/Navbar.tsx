export default function Navbar() {
  return (
    <nav className="px-6 py-4 border-b border-zinc-800 flex justify-between">
      <h1 className="text-xl font-bold text-green-400">
        <a href="localhost:3000/">
          OpenSight
        </a>
      </h1>
      <span className="text-sm text-zinc-400">
        a lightweight reconnaissance toolkit
      </span>
    </nav>
  );
}
