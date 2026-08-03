import { useEffect, useState } from "react";
import { getAwareness } from "../collaboration/yjs";
import type { AwarenessState } from "../collaboration/Awareness";


export function useAwareness() {

  const [localClientId, setLocalClientId] = useState<number | null>(
    null
  );
  const [states, setStates] = useState<
    Map<number, AwarenessState>
  >(new Map());
 
  useEffect(() => {
    const awareness = getAwareness();
      setLocalClientId(awareness.clientID);
    const handleChange = () => {
      setStates(
        new Map(awareness.getStates() as Map<
          number,
          AwarenessState
        >),
      );
    };

    awareness.on("change", handleChange);

    // Initial state
    handleChange();

    return () => {
      awareness.off("change", handleChange);
    };
  }, []);

    return {
    states,
    localClientId,
  };
}