import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import { Player } from '../types';

export default function PlayerPage() {
  const { login } = useParams<{ login: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<number>(356);
  const navigate = useNavigate();

  useEffect(() => {
    // Given
    if (!login) return;

    setLoading(true);
    setError(null);

    // When
    fetch(`http://localhost:3000/player/ranking/${login}?days=${days}`)
      .then((res) => res.json())
      .then((data) => {
        // Then
        setPlayers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [login, days]);

  const columns = [
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
      {!loading && !error && (
        <Table data={players} columns={columns} />
      )}
    </div>
  );
}

