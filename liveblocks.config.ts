import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'

// Connect to our API route
const client = createClient({
  authEndpoint: '/api/liveblockauth',
})

// Define user presence
type Presence = {
  cursor: { x: number, y: number } | null;
  selectedId: string | null;
}

// Pass client and Presence to createRoomContext & create React utilities
export const {
  RoomProvider,
  useUpdateMyPresence,
  useOthers,
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useSelf
} = createRoomContext<Presence>(client)