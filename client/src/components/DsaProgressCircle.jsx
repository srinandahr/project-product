import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

export default function DsaProgressCircle({ topic, completed, total }) {
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const data = [{ name: topic, value: Math.max(5, pct) }]; // min angle for visibility

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition">
      <h3 className="font-semibold text-center mb-2">{topic}</h3>
      <ResponsiveContainer width="100%" height={140}>
        <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={180} endAngle={-180}>
          <RadialBar dataKey="value" cornerRadius={10} minAngle={8} />
          <Tooltip formatter={(v) => `${pct}%`} />
        </RadialBarChart>
      </ResponsiveContainer>
      <p className="text-center font-semibold">{pct}% Completed</p>
    </div>
  );
}
