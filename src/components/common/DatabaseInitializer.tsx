"use client";

import { useEffect } from "react";
import { useCMSStore } from "@/store/cmsStore";

export default function DatabaseInitializer() {
  const initializeFromDatabase = useCMSStore((state) => state.initializeFromDatabase);

  useEffect(() => {
    initializeFromDatabase();
  }, [initializeFromDatabase]);

  return null;
}
