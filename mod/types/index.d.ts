// The open loops list as the mod holds it, read from Ayda's `open_loops` result. The server owns the full shape (`OpenLoopsResult` and
// `open_loops_text` in the Ayda product repository).

export type Loop = {
  id: string
  // The ask itself.
  title: string
  // Who it is with, and where and when it was raised.
  meta: string
  // The due day, as YYYY-MM-DD. Present only when the result came as
  // structured data; the text form has it in `meta`.
  due?: string
  // The record that raised the loop. Present only when the result came as
  // structured data; the text form has it in `meta`.
  raised?: { title: string; url?: string }
  // Ayda proposes that the loop is done and waits for the member's verdict.
  looksDone: boolean
  // Present only when the result came as structured data.
  evidence?: string
  reason?: string
}

export type Loops = {
  your_move: Loop[]
  waiting: Loop[]
  done: Loop[]
  counts: { open: number; your_move: number; waiting: number; done: number }
}

// `busy` is true while a call for the list is in flight.
export type LoopsState = { loops: Loops | null; error: string | null; busy: boolean }

declare module 'claude-code' {
  interface PluginState {
    ayda: { loops: LoopsState }
  }
}
