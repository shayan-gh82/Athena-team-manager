import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { mockAutomationRules } from '@/data/mock'
import type { AutomationAction, AutomationRule, AutomationTrigger } from '@/types'
import { createId } from '@/utils/id'

type AutomationState = { rules: AutomationRule[] }
const initialState: AutomationState = { rules: mockAutomationRules }

const automationSlice = createSlice({
  name: 'automation', initialState,
  reducers: {
    addAutomationRule(state, action: PayloadAction<{ name: string; trigger: AutomationTrigger; action: AutomationAction; projectId?: string }>) {
      state.rules.push({ id: createId(), enabled: true, createdAt: new Date().toISOString(), ...action.payload })
    },
    toggleAutomationRule(state, action: PayloadAction<string>) { const item = state.rules.find((x) => x.id === action.payload); if (item) item.enabled = !item.enabled },
    removeAutomationRule(state, action: PayloadAction<string>) { state.rules = state.rules.filter((x) => x.id !== action.payload) },
  },
})

export const { addAutomationRule, toggleAutomationRule, removeAutomationRule } = automationSlice.actions
export default automationSlice.reducer
