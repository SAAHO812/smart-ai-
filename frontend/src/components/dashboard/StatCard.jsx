import React from 'react';

export default function StatCard({ title, value, icon, color }) {
  // Map color names to Tailwind classes
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    amber: 'bg-amber-50 border-amber-200',
    red: 'bg-red-50 border-red-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <div className={`card p-5 border ${colorClasses[color]} transition-transform duration-300 transform hover:scale-105`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-white shadow-subtle" role="img" aria-label={`${title} icon`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
