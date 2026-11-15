export default function InputField({ label, name, value, onChange, type = "text", ...rest }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} name={name} value={value} onChange={onChange} {...rest} />
    </label>
  );
}