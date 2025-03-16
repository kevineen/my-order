import { redirect } from "next/navigation";

export default async function Home() {
  // ダッシュボードにリダイレクト
  redirect("/dashboard");
}
