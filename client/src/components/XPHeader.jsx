import React from 'react';
import { FaBolt, FaFireAlt, FaTrophy } from 'react-icons/fa';

function xpToLevel(xp) {
  // Simple curve: level every 100 XP
  const level = Math.floor(xp / 100) + 1;
  const current = xp % 100;
  const next = 100;
  return { level, current, next, pct: Math.min(100, Math.round((current / next) * 100)) };
}

export default function XPHeader({ totalXP = 0, streakDays = 0 }) {
  const { level, pct, current, next } = xpToLevel(totalXP);

  return (
    <div className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
        {/* Badge */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 border border-white/30 grid place-items-center shadow-lg">
            <FaTrophy className="text-yellow-300" size={36} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">Level {level}</h1>
            <p className="text-white/90">Job Hunt Hero</p>
          </div>
        </div>

        {/* XP bar */}
        <div className="w-full md:max-w-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2">
              <FaBolt /> XP: {current}/{next}
            </span>
            <span className="text-sm">{pct}%</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full mt-2 overflow-hidden">
            <div
              className="h-3 bg-yellow-300 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
          <FaFireAlt className="text-orange-300" />
          <span className="font-semibold">{streakDays}-day streak</span>
        </div>
      </div>
    </div>
  );
}
