import React, { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api/api';
import { FaBriefcase } from 'react-icons/fa';

const COLORS = ['#8b5cf6','#22c55e','#f59e0b','#10b981','#ef4444'];

export default function JobsFlipCard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await API.get('/jobs');
      setJobs(res.data || []);
    })();
  }, []);

  const data = useMemo(() => {
    const byStatus = {};
    jobs.forEach(j => byStatus[j.status] = (byStatus[j.status] || 0) + 1);
    return Object.entries(byStatus).map(([name, value]) => ({ name, value }));
  }, [jobs]);

  const totals = useMemo(() => ({
    total: jobs.length,
    applied: jobs.filter(j => j.status === 'Applied').length,
    callback: jobs.filter(j => j.status === 'Callback').length,
    interviewed: jobs.filter(j => j.status === 'Interviewed').length,
    offer: jobs.filter(j => j.status === 'Offer').length,
    rejected: jobs.filter(j => j.status === 'Rejected').length
  }), [jobs]);

  return (
    <div className="relative group [perspective:1000px]">
      <div className="relative h-80 rounded-2xl shadow-xl bg-white transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front */}
        <div className="absolute inset-0 p-4 [backface-visibility:hidden]">
          <div className="flex items-center gap-2 mb-3">
            <FaBriefcase className="text-purple-600" />
            <h2 className="text-lg font-bold">Jobs — Status Split</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Back */}
        <div className="absolute inset-0 p-4 [transform:rotateY(180deg)] [backface-visibility:hidden] bg-gradient-to-br from-purple-50 to-pink-50">
          <h2 className="text-lg font-bold mb-3">Jobs — Quick Stats</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Total</span><span className="font-semibold">{totals.total}</span></li>
            <li className="flex justify-between"><span>Applied</span><span className="font-semibold">{totals.applied}</span></li>
            <li className="flex justify-between"><span>Callback</span><span className="font-semibold">{totals.callback}</span></li>
            <li className="flex justify-between"><span>Interviewed</span><span className="font-semibold">{totals.interviewed}</span></li>
            <li className="flex justify-between"><span>Offer</span><span className="font-semibold text-green-700">{totals.offer}</span></li>
            <li className="flex justify-between"><span>Rejected</span><span className="font-semibold text-red-700">{totals.rejected}</span></li>
          </ul>
          <p className="mt-4 text-xs text-purple-700">Tip: hover to flip the card.</p>
        </div>
      </div>
    </div>
  );
}
