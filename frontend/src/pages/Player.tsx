import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import { Player } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export default function PlayerPage() {
  const { login } = useParams<{ login: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<number>(356);
  const navigate = useNavigate();

  useEffect(() => {
    if (!login) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/player/ranking/${login}?days=${days}`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => (a.date < b.date ? 1 : -1));
        setPlayers(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [login, days]);

  const columns = [
    {
      key: 'ranking' as keyof Player,
      label: '#',
      render: (value: number) => value,
    },
    { key: 'date' as keyof Player, label: 'Date' },
    {
      key: 'experience' as keyof Player,
      label: 'Experience',
      render: (value: number) => value.toLocaleString(),
    },
    {
      key: 'rankingChange' as keyof Player,
      label: 'Ranking Change',
      render: (value: number) => {
        const className =
          value > 0
            ? 'badge badge-positive'
            : value < 0
            ? 'badge badge-negative'
            : 'badge badge-neutral';
        return (
          <span className={className}>
            {value > 0 ? '+' : ''}
            {value}
          </span>
        );
      },
    },
  ];

  const chartData = useMemo(() => {
    const chronological = [...players].reverse();
    const labels = chronological.map((player) => player.date);
    const rankingData = chronological.map((player) => player.ranking);
    return {
      labels,
      datasets: [
        {
          label: 'Ranking position',
          data: rankingData,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          tension: 0.3,
        },
      ],
    };
  }, [players]);

  const chartOptions = {
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false },
    stacked: false,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      y: {
        type: 'linear' as const,
        position: 'left' as const,
        reverse: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="container">
      <div className="header">
        <h1>👤 Player: {login}</h1>
        <p>Ranking history</p>
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ← Back to Ranking
          </button>
          <label htmlFor="days" style={{ marginRight: '10px' }}>
            Days:
          </label>
          <input
            id="days"
            type="number"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10) || 356)}
            min="1"
            max="365"
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '100px',
            }}
          />
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && players.length > 0 && (
        <div className="chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
      {!loading && !error && (
        <Table data={players} columns={columns} />
      )}
    </div>
  );
}

