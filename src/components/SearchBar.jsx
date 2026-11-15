export default function SearchBar({ query, onChange }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="🔍 Search by owner, vehicle or checkpost..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}