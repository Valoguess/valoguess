import { Room } from '@/types/game'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type RoomStore = {
  hydrated: boolean
  setHydrated: (hydrated: boolean) => void
  
  room: Room | null
  setRoom: (room: Room) => void
  clearRoom: () => void
}

export const useRoomStore = create<RoomStore>()(
  persist(
    (set, get) => ({
      hydrated: false,
      room: null,
      setRoom: (room: Room) => set({ room: room ? { ...room } : null }),
      clearRoom: () => set({ room: null }),
      setHydrated: (hydrated: boolean) => set({ hydrated }),
    }),
    {
      name: 'roomStore', // name of the item in the storage (must be unique)
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      }
    },
  ),
)