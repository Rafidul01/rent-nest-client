import { getMyPayments } from "@/app/(dashboardGroup)/tenant-dashboard/_actions/getMyPayments";
import { PaymentStatus } from "./PaymentStatus";

interface PaymentSuccessProps {
  params: Promise<{ transactionId: string }>;
}

export default async function PaymentSuccessPage({
  params,
}: PaymentSuccessProps) {
  const { transactionId } = await params;

  let payment = null;
  try {
    const { data: payments } = await getMyPayments();
    payment =
      payments.find((p) => p.transactionId === transactionId) ?? null;
  } catch {
    payment = null;
  }

  return <PaymentStatus transactionId={transactionId} initial={payment} />;
}
