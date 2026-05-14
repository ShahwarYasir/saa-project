import { useState, useMemo } from 'react';

export default function AdminTable({ columns, data, onEdit, onDelete, extraActions = null, searchFields = [] }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(row => searchFields.some(f => String(row[f] || '').toLowerCase().includes(q)));
  }, [data, search, searchFields]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const va = a[sortKey] ?? '', vb = b[sortKey] ?? '';
      const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div>
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 320 }} />
      </div>
      <div className="table-responsive">
        <table className="table saa-admin-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  {col.label} {sortKey === col.key && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="text-center py-4" style={{ color: 'var(--saa-gray-400)' }}>No records found</td></tr>
            ) : paged.map(row => (
              <tr key={row.id}>
                {columns.map(col => (
                  <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
                ))}
                <td>
                  <div className="d-flex gap-1">
                    {onEdit && <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(row)}><i className="bi bi-pencil"></i></button>}
                    {onDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(row.id)}><i className="bi bi-trash"></i></button>}
                    {extraActions?.(row)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <nav><ul className="pagination saa-pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul></nav>
      )}
    </div>
  );
}
