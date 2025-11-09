import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import { Player } from '../types';

export default function Ranking() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/ranking?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [date]);

  const handleRowClick = (row: Player) => {
    navigate(`/player/${row.login}`);
  };

  const columns = [
    {
      key: 'id' as keyof Player,
      label: '#',
      render: (_value: number, _row: Player, index: number) => index + 1,
    },
    { key: 'login' as keyof Player, label: 'Login' },
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

  return (
    <div className="container">
      <div className="header">
        <h1>🎮 Player Ranking</h1>
        <p>Top 50 players by experience</p>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="date" style={{ marginRight: '10px' }}>
            Date:
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && players.length === 0 && (
        <div className="no-data">No data available for the selected date.</div>
      )}
      {!loading && !error && players.length > 0 && (
        <Table data={players} columns={columns} onRowClick={handleRowClick} />
      )}
    </div>
  );
}

