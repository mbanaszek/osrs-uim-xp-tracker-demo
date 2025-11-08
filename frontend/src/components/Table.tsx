import { Player } from '../types';

interface TableProps {
  data: Player[];
  columns: Array<{
    key: keyof Player;
    label: string;
    render?: (value: any, row: Player) => React.ReactNode;
  }>;
  onRowClick?: (row: Player) => void;
}

export default function Table({ data, columns, onRowClick }: TableProps) {
  return (
    <table className="table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={row.id}
            onClick={() => onRowClick?.(row)}
            style={onRowClick ? { cursor: 'pointer' } : {}}
          >
            {columns.map((column) => (
              <td key={column.key}>
                {column.render
                  ? column.render(row[column.key], row)
                  : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

