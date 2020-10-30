import { useEffect, useState } from "react";

const parseHash = (hash: string) => (hash || "#").slice(1);

export const useHash = (location: Location) => {
  const [state, setState] = useState<string>(parseHash(location.hash));
  useEffect(() => {
    (() => {
      setState(parseHash(location.hash));
    })();
  }, [location.hash]);
  const setHash = (hash: any) => {
    window.location.hash = String(hash);
  };
  return [state, setHash] as [typeof state, typeof setHash];
};
