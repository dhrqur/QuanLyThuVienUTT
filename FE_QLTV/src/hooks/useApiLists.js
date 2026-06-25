import { useEffect, useState } from "react";

import { api } from "@/lib/api";

export function useApiLists(modules) {
  const moduleKey = modules.join(",");
  const [data, setData] = useState({});

  useEffect(() => {
    let active = true;
    const requestedModules = moduleKey.split(",").filter(Boolean);

    async function load() {
      try {
        const responses = await Promise.all(
          requestedModules.map(async (module) => [module, (await api.getAll(module)).data ?? []]),
        );
        if (active) setData(Object.fromEntries(responses));
      } catch {
        if (active) setData({});
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [moduleKey]);

  return { data };
}
