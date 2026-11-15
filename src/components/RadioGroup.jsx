export default function RadioGroup({ legend, name, value, onChange, options }) {
  return (
    <fieldset className="radio-group">
      <legend>{legend}</legend>
      {options.map((o) => (
        <label key={o}>
          <input
            type="radio"
            name={name}
            value={o}
            checked={value === o}
            onChange={onChange}
          />
          {o}
        </label>
      ))}
    </fieldset>
  );
}