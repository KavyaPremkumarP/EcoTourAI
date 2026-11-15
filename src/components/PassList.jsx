export default function PassList({ passes, onEdit, onDelete }) {
  if (passes.length === 0) return <p className="empty">No passes found.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Pass ID</th>
            <th>Owner</th>
            <th>Vehicle</th>
            <th>Type</th>
            <th>Passengers</th>
            <th>Date</th>
            <th>Checkpost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {passes.map((p) => (
            <tr key={p.id}>
              <td>OOTY-{p.id}</td>
              <td>{p.ownerName}</td>
              <td>{p.vehicle}</td>
              <td>{p.vehicleType}</td>
              <td>{p.passengers}</td>
              <td>{p.visitDate}</td>
              <td>{p.gate}</td>
              <td>
                <div className="row-actions">
                  <button className="btn edit" onClick={() => onEdit(p)}>Edit</button>
                  <button className="btn delete" onClick={() => onDelete(p.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}