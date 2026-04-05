import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href={"/dashboard"}>Dashboard Page</Link>
    </main>
  );
}
