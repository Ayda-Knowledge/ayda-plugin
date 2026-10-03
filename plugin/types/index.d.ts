// The open loops list as the mod holds it, read from the text form of Ayda's
// `open_loops` result. The server owns the full shape (`OpenLoopsResult` and
// `open_loops_text` in the Ayda product repository).

export type Loop = {
  id: string
  // The loop as the server wrote it for a person: the ask, who it is with,
  // a due date, and the record that raised it.
  text: string
  // Ayda proposes that the loop is done and waits for the member's verdict.
  looksDone: boolean
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
