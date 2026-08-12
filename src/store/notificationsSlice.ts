import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Notification } from '@/types'
import { createId } from '@/utils/id'

type NotificationState = { notifications: Notification[] }
const initialState: NotificationState = { notifications: [] }

const notificationsSlice = createSlice({
  name: 'notifications', initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt' | 'isRead'>>) {
      if (action.payload.signature && state.notifications.some((n) => n.signature === action.payload.signature)) return
      state.notifications.unshift({ id: createId(), createdAt: new Date().toISOString(), isRead: false, ...action.payload })
      state.notifications = state.notifications.slice(0, 100)
    },
    markNotificationRead(state, action: PayloadAction<string>) { const item = state.notifications.find((n) => n.id === action.payload); if (item) item.isRead = true },
    markAllNotificationsRead(state, action: PayloadAction<string>) { state.notifications.forEach((n) => { if (n.userId === action.payload) n.isRead = true }) },
    clearNotifications(state, action: PayloadAction<string>) { state.notifications = state.notifications.filter((n) => n.userId !== action.payload) },
  },
})

export const { addNotification, markNotificationRead, markAllNotificationsRead, clearNotifications } = notificationsSlice.actions
export default notificationsSlice.reducer
