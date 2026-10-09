import { useEffect, useState } from 'react';
export function useFinePointer() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return enabled;
}
