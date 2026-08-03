import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import type { PlacedItem } from "../types/assetTypes";

let ydoc: Y.Doc | null = null;
let itemsMap: Y.Map<PlacedItem> | null = null;
let provider: WebsocketProvider | null = null;

export const joinRoom = (roomId: string) => {

  leaveRoom();
  ydoc = new Y.Doc();
  itemsMap = ydoc.getMap<PlacedItem>("items");

  provider = new WebsocketProvider(
    "ws://localhost:1234",
    `landscape-room-${roomId}`,
    ydoc,
    {
    params: {
      token: localStorage.getItem("auth_token") || "",
    },
  }
  );

  provider.on(
    "status",
    (event: { status: "connected" | "disconnected" }) => {
      console.log(
        `[Yjs Room Status]: ${event.status} for room: ${roomId}`,
      );
    },
  );

  return {
    ydoc,
    itemsMap,
    provider,
  };
};

export const getItemsMap = (): Y.Map<PlacedItem> => {
  if (!itemsMap) {
    throw new Error(
      "Yjs room has not been initialized. Call joinRoom() first.",
    );
  }

  return itemsMap;
};

export const getYDoc = (): Y.Doc => {
  if (!ydoc) {
    throw new Error(
      "Yjs room has not been initialized. Call joinRoom() first.",
    );
  }

  return ydoc;
};

export const getAwareness = () => {
  if (!provider) {
    throw new Error(
      "Yjs provider has not been initialized. Call joinRoom() first.",
    );
  }

  return provider.awareness;
};

export const leaveRoom = () => {
  if (provider) {
    provider.destroy();
    provider = null;
  }

  if (ydoc) {
    ydoc.destroy();
    ydoc = null;
  }

  itemsMap = null;

};