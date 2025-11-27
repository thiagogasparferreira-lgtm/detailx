export function photoUrlFor(name: string) {
  const q = encodeURIComponent(name + ' car detailing product studio neutral background');
  return `https://source.unsplash.com/featured/640x640/?${q}`;
}