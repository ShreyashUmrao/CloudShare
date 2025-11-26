import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Spinner from "../components/Spinner";

export default function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState({ total_downloads: 0, timeseries: [], recent_accesses: [] });
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await api.get(`/files/analytics/${id}/`);
      const ts = (res.data.timeseries || []).map(p => ({ ...p, timeLabel: new Date(p.time).toLocaleTimeString() }));
      setData({ ...res.data, timeseries: ts });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 5000);
    return () => clearInterval(iv);
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Analytics</h2>
          <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white">Back to files</Link>
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <p className="text-sm text-gray-300">Total downloads: {data.total_downloads}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded h-64">
          {loading ? (
            <div className="h-full flex items-center justify-center"><Spinner /></div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeseries}>
                <XAxis dataKey="timeLabel" tick={{ fill: '#cbd5e1' }} />
                <YAxis tick={{ fill: '#cbd5e1' }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded">
          <h3 className="font-semibold">Recent Accesses</h3>
          <div className="overflow-auto max-h-64 mt-2">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-sm">
                  <th className="p-2">When</th>
                  <th className="p-2">IP → Geo</th>
                  <th className="p-2">Browser</th>
                  <th className="p-2">OS</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_accesses.map((r, idx) => (
                  <tr key={idx} className="border-t border-gray-700 text-sm">
                    <td className="p-2">{new Date(r.timestamp).toLocaleString()}</td>
                    <td className="p-2">{r.ip} {r.geo ? `→ ${r.geo.city || ''}, ${r.geo.country || ''}` : ''}</td>
                    <td className="p-2">{r.browser}</td>
                    <td className="p-2">{r.os}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
