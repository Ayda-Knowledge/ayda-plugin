// The fields of Ayda's `open_loops` result that the mod draws. The server
// owns the full shape (`OpenLoopsResult` in the Ayda product repository).

export type LoopRecord = {
  title: string
  source: string
  created_at?: string | null
}

export type Loop = {
  id: string
  summary: string
  status: 'open' | 'looks_done' | 'done' | 'dismissed'
  counterpart_name?: string | null
  due_at?: string | null
  raised: LoopRecord
  evidence?: string | null
  ayda_confident?: { summary: string } | null
}

export type Loops = {
  your_move: Loop[]
  waiting: Loop[]
  done: Loop[]
  counts: { open: number; your_move: number; waiting: number; done: number }
}

export type LoopsState = { loops: Loops | null; error: string | null }

declare module 'claude-code' {
  interface PluginState {
    ayda: { loops: LoopsState }
  }
}
