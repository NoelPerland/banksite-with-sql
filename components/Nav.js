import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-4 fixed top-0 left-0 w-full z-10">
      <Link href="/">Home</Link>
      <Link href="/login">Log in</Link>
      <Link href="/register">Create Acount</Link>
    </nav>
  );
}
