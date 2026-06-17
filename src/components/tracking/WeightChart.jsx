import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 shadow-sm">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
        {payload[0].value} kg
      </p>
    </div>
  )
}

export default function WeightChart({ petId, petName }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState(30) // days

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const from = new Date()
      from.setDate(from.getDate() - range)

      const { data } = await supabase
        .from('weight_logs')
        .select('weight, logged_at')
        .eq('pet_id', petId)
        .gte('logged_at', from.toISOString())
        .order('logged_at', { ascending: true })

      const formatted = (data || []).map(d => ({
        weight: d.weight,
        date: new Date(d.logged_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
      }))

      setData(formatted)
      setLoading(false)
    }
    fetch()
  }, [petId, range])

  const RANGES = [
    { label: '2W', days: 14 },
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
    { label: 'All', days: 3650 },
  ]

  // calculate trend
  const trend = data.length >= 2
    ? (data[data.length - 1].weight - data[0].weight).toFixed(1)
    : null

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">📈 Weight History</h3>
          {trend !== null && (
            <p className={`text-xs mt-0.5 ${
              parseFloat(trend) > 0
                ? 'text-red-400 dark:text-red-500'
                : parseFloat(trend) < 0
                ? 'text-green-500 dark:text-green-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}>
              {parseFloat(trend) > 0 ? '↑' : parseFloat(trend) < 0 ? '↓' : '→'}
              {' '}{Math.abs(trend)} kg over this period
            </p>
          )}
        </div>

        {/* Range selector */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {RANGES.map(r => (
            <button key={r.days} onClick={() => setRange(r.days)}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                range === r.days
                  ? 'bg-white dark:bg-gray-700 text-violet-700 dark:text-violet-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-sm text-gray-400 dark:text-gray-600">Loading...</p>
        </div>
      ) : data.length < 2 ? (
        <div className="h-48 flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-2xl">⚖️</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
            Log at least 2 weights<br />to see the chart
          </p>
        </div>
      ) : (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-gray-100 dark:text-gray-800"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                stroke="currentColor"
                className="text-gray-400 dark:text-gray-500"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                stroke="currentColor"
                className="text-gray-400 dark:text-gray-500"
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                tickFormatter={v => `${v}kg`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#7C3AED"
                strokeWidth={2}
                dot={{ fill: '#7C3AED', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#7C3AED', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Min / Max / Avg stats */}
      {data.length >= 2 && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Lowest', value: `${Math.min(...data.map(d => d.weight))} kg` },
            { label: 'Average', value: `${(data.reduce((s, d) => s + d.weight, 0) / data.length).toFixed(1)} kg` },
            { label: 'Highest', value: `${Math.max(...data.map(d => d.weight))} kg` },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}