export function toggleChipValue(current = "", value) {
  const parts = current
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);

  const index = parts.findIndex(
    v => v.toLowerCase() === value.toLowerCase()
  );

  if (index >= 0) {
    parts.splice(index, 1); // deseleccionar
  } else {
    parts.push(value); // seleccionar
  }

  return parts.join(", ");
}

export function hasChip(current = "", value) {
  return current
    .split(",")
    .map(v => v.trim().toLowerCase())
    .includes(value.toLowerCase());
}
