import { getAwareness } from "./yjs";

export interface AwarenessUser {
  id: string;
  username: string;
  email:string
}

export interface AwarenessEditing {
  itemId: string;
  field: string;
}

export interface AwarenessState {
  user?: AwarenessUser;
  selectedItemId?: string | null;
  editing?: AwarenessEditing | null;
}

export const setCurrentUser = (user: AwarenessUser) => {
  const awareness = getAwareness();

  awareness.setLocalStateField("user", user);
};

export const setSelectedItem = (
  itemId: string | null,
) => {
  const awareness = getAwareness();

  awareness.setLocalStateField(
    "selectedItemId",
    itemId,
  );
};

export const setEditing = (
  itemId: string,
  field: string,
) => {
  const awareness = getAwareness();

  awareness.setLocalStateField("editing", {
    itemId,
    field,
  });
};

export const clearEditing = () => {
  const awareness = getAwareness();

  awareness.setLocalStateField(
    "editing",
    null,
  );
};