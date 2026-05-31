import { useState, useMemo } from 'react';

interface Dumbbell { id: string; name: string; tier: number; musclePerStep: number; cost: number; }
interface Pet { id: string; name: string; rarity: string; muscleBonus: number; }

const REBIRTHS = [
  { level: 0, mult: 1 }, { level: 1, mult: 1.5 }, { level: 2, mult: 2 }, { level: 3, mult: 3 },
  { level: 5, mult: 5 }, { level: 7, mult: 10 }, { level: 10, mult: 15 }, { level: 15, mult: 100 }, { level: 17, mult: 200 },
];

function formatNum(n: number): string {
  if (n >= 1e15) return (n / 1e15).toFixed(1) + 'Q';
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
}

export default function CalculatorClient({ dumbbells, pets }: { dumbbells: Dumbbell[]; pets: Pet[] }) {
  const [dbId, setDbId] = useState(dumbbells[0]?.id || '');
  const [rebirth, setRebirth] = useState(0);
  const [petId, setPetId] = useState('');
  const [boost, setBoost] = useState(false);

  const result = useMemo(() => {
    const db = dumbbells.find(d => d.id === dbId);
    const rb = REBIRTHS.find(r => r.level === rebirth) || REBIRTHS[0];
    const pet = pets.find(p => p.id === petId);
    const mps = (db?.musclePerStep || 1) * rb.mult * (pet?.muscleBonus || 1) * (boost ? 2 : 1);
    const nextDb = dumbbells.find(d => d.tier === (db?.tier || 1) + 1);
    return { mps, db, rb, pet, nextDb };
  }, [dbId, rebirth, petId, boost]);

  return (
    <div class="max-w-5xl mx-auto px-4 py-10">
      <h1 class="text-3xl font-extrabold tracking-tight mb-2">💪 Muscle Calculator</h1>
      <p class="text-gray-500 mb-8">Select your dumbbell, rebirth level, pet, and boosts.</p>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <div>
            <h2 class="font-bold mb-3">🏋️ Dumbbell</h2>
            <div class="grid grid-cols-2 gap-2">
              {dumbbells.map(db => (
                <button key={db.id} onClick={() => setDbId(db.id)}
                  class={`p-3 rounded-lg border text-left text-sm ${dbId === db.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <div class="font-semibold">{db.name}</div>
                  <div class="text-xs text-gray-500">{formatNum(db.musclePerStep)} muscle/step</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 class="font-bold mb-3">🔄 Rebirth Level</h2>
            <select value={rebirth} onChange={e => setRebirth(Number(e.target.value))} class="w-full p-3 rounded-lg border bg-white">
              {REBIRTHS.map(r => <option key={r.level} value={r.level}>Rebirth {r.level} — {r.mult}x</option>)}
            </select>
          </div>
          <div>
            <h2 class="font-bold mb-3">🐾 Pet</h2>
            <select value={petId} onChange={e => setPetId(e.target.value)} class="w-full p-3 rounded-lg border bg-white">
              <option value="">No Pet (1x)</option>
              {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.rarity}) — {p.muscleBonus}x</option>)}
            </select>
          </div>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={boost} onChange={e => setBoost(e.target.checked)} class="w-4 h-4 accent-blue-600" />
            <span class="text-sm">2x Muscle Boost</span>
          </label>
        </div>
        <div class="space-y-4">
          <div class="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border text-center">
            <div class="text-sm text-gray-500 mb-1">Muscle Per Step</div>
            <div class="text-5xl font-black text-amber-500">{formatNum(result.mps)}</div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-4 rounded-xl bg-gray-50 border text-center"><div class="text-xs text-gray-500">Base</div><div class="text-xl font-bold">{result.db?.musclePerStep || 1}</div></div>
            <div class="p-4 rounded-xl bg-gray-50 border text-center"><div class="text-xs text-gray-500">Rebirth</div><div class="text-xl font-bold">{result.rb.mult}x</div></div>
            <div class="p-4 rounded-xl bg-gray-50 border text-center"><div class="text-xs text-gray-500">Pet</div><div class="text-xl font-bold">{result.pet?.muscleBonus || 1}x</div></div>
            <div class="p-4 rounded-xl bg-gray-50 border text-center"><div class="text-xs text-gray-500">Boost</div><div class="text-xl font-bold">{boost ? 2 : 1}x</div></div>
          </div>
          {result.nextDb && (
            <div class="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <h3 class="font-bold mb-1">Next: {result.nextDb.name}</h3>
              <p class="text-sm text-gray-600">~{formatNum(Math.ceil(result.nextDb.cost / result.mps))} steps ({formatNum(result.nextDb.cost)} Wins)</p>
            </div>
          )}
          <div class="p-4 rounded-xl bg-gray-50 border">
            <h3 class="font-bold mb-3">Steps to Goals</h3>
            <div class="space-y-2 text-sm">
              {[{l:'10K',v:10000},{l:'1M',v:1e6},{l:'100M',v:1e8},{l:'1B',v:1e9}].map(g => (
                <div class="flex justify-between"><span class="text-gray-500">{g.l} Muscle</span><span class="font-mono font-bold">{formatNum(Math.ceil(g.v/result.mps))} steps</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
