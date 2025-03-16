import { useEffect } from "react";
import { useRouter } from "next/router";

export default function OrdersPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/orders");
  }, [router]);

  return null;
}
