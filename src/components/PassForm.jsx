import { useState } from "react";
import InputField from "./InputField";
import SelectField from "./SelectField";
import RadioGroup from "./RadioGroup";
import checkpoints from "../data/checkpoints";

const emptyForm = {
  ownerName: "",
  vehicle: "",
  phone: "",
  passengers: 1,
  visitDate: "",
  vehicleType: "Car",
  gate: "Kallar",
  plastic: false,
};

export default function PassForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(editing ?? emptyForm);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.ownerName.trim()) return setError("Owner name is required.");
    if (!/^[A-Z]{2}-?\d{1,2}-?[A-Z]{1,3}-?\d{1,4}$/.test(form.vehicle.trim().toUpperCase()))
      return setError("Enter a valid vehicle number, e.g. KA-01-MJ-4820.");
    if (!/^\d{10}$/.test(form.phone)) return setError("Phone must be 10 digits.");
    if (Number(form.passengers) < 1 || Number(form.passengers) > 50)
      return setError("Passengers must be between 1 and 50.");
    if (!form.visitDate) return setError("Select a visit date.");
    if (form.plastic)
      return setError("Single-use plastic is banned. Untick it after swapping for an eco product.");

    setError("");
    onSave({
      ...form,
      vehicle: form.vehicle.trim().toUpperCase(),
      passengers: Number(form.passengers),
    });
    if (!editing) setForm(emptyForm);
  };

  return (
    <form className="pass-form" onSubmit={handleSubmit}>
      <h2>{editing ? "✏️ Edit E-Pass" : "🎫 Apply E-Pass"}</h2>

      <div className="form-grid">
        <InputField label="Owner Name" name="ownerName" value={form.ownerName}
          onChange={handleChange} placeholder="Ravi Kumar" />
        <InputField label="Vehicle Number" name="vehicle" value={form.vehicle}
          onChange={handleChange} placeholder="KA-01-MJ-4820" maxLength={15} />
        <InputField label="Phone" name="phone" value={form.phone}
          onChange={handleChange} placeholder="10-digit number" maxLength={10} />
        <InputField label="Passengers" name="passengers" type="number" value={form.passengers}
          onChange={handleChange} min="1" max="50" />
        <InputField label="Visit Date" name="visitDate" type="date" value={form.visitDate}
          onChange={handleChange} />
        <SelectField label="Entry Checkpost" name="gate" value={form.gate}
          onChange={handleChange} options={checkpoints.map((c) => c.name)} />
      </div>

      <RadioGroup legend="Vehicle Type" name="vehicleType" value={form.vehicleType}
        onChange={handleChange} options={["Two-Wheeler", "Car", "Van", "Bus"]} />

      <label className="check">
        <input type="checkbox" name="plastic" checked={form.plastic} onChange={handleChange} />
        I am carrying single-use plastic ⚠️
      </label>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button type="submit" className="btn primary">
          {editing ? "Update Pass" : "Generate Pass"}
        </button>
        {editing && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}