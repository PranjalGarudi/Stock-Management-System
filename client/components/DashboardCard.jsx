export default function DashboardCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
