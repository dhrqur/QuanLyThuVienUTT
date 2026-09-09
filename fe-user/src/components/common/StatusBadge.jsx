import { requestStatus } from "@/utils/format";

export default function StatusBadge({ status }) {
  const [label, className] = requestStatus(status);
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold ${className}`}>{label}</span>;
}
