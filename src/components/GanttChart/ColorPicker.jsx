export default function ColorPicker({ color, onChange, disabled }) {
  return (
    <input
      type="color"
      className="color-picker"
      value={color}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      title="Bar color"
    />
  );
}
