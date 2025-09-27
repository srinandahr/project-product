import React, { useEffect, useMemo, useState } from 'react';
import API from '../api/api';
import DsaProgressCircle from './DsaProgressCircle';
import { FaCode } from 'react-icons/fa';

export default function DsaProgressGrid() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await API.get('/dsas');
      setItems(res.data || []);
    })();
  }, []);

  const perTopic = useMemo(() => {
    const map = {};
    items.forEach(i => {
      if (!map[i.topic]) map[i.topic] = { total: 0, completed: 0 };
      map[i.topic].total += 1;
      if (i.status === 'Completed') map[i.topic].completed += 1;
    });
    return map;
  }, [items]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <FaCode className="text-emerald-600" />
        <h2 className="text-lg font-bold">DSA — Topic Progress</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(perTopic).length === 0 && (
          <p className="text-sm text-gray-600">Add some DSA items to see progress.</p>
        )}
        {Object.entries(perTopic).map(([topic, { completed, total }]) => (
          <DsaProgressCircle key={topic} topic={topic} completed={completed} total={total} />
        ))}
      </div>
    </div>
  );
}
