// The Ayda mod for Claude Code. Claude Code does not show Ayda's MCP Apps, so
// this module draws two of them from the same tool results: the open loops
// list (a band and a pane) and the citation card under an `ask` call.
//
// The two verdict buttons call `decide_open_loop` on the member's own press.
// No model is in that path, so record text can never cause a write.

import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Loop, Loops, LoopsState } from '../types'

const PANE = 'ayda-loops'
const PANE_TITLE = 'Ayda open loops'
const REFRESH_MS = 15 * 60 * 1000
// Loops asked for in each group. Claude Code refuses an MCP result above its
// size limit, and a full list of 20 loops in each group is above it. The
// counts are for the whole list at any limit. The second value is the retry.
const GROUP_LIMITS = [5, 2]
const CITATIONS_SHOWN = 5
const WARNING = 'yellow'

// The same server can run under several names: the plugin's own `ayda`, a
// member's own entry, or an organisation connector on claude.ai.
const TODAY = /^mcp__.*ayda.*__today$/i
const DECIDE = /^mcp__.*ayda.*__decide_open_loop$/i
const ANSWERS = /^mcp__.*ayda.*__(ask|research_brief)$/i

const initial: LoopsState = { loops: null, error: null }
const loopsState = atom({ plugin: 'ayda', key: 'loops' } as const, initial)

type Citation = {
  title: string
  source: string
  url?: string
  started_at?: string | null
  temporal_assertions?: { conflict_status?: string | null; evidence_status?: string }[]
}

type Answer = { citations: Citation[]; temporal?: { status?: string } | null }

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

// An MCP result reaches a render hook as the structured result, as content
// blocks, or as the text form (a JSON dump for `ask`). Read all three.
function readAnswer(output: unknown): Answer | null {
  let value = output
  if (isObject(value) && isObject(value.structuredContent)) value = value.structuredContent
  if (Array.isArray(value)) value = value.find(block => isObject(block) && block.type === 'text')?.text
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
      return null
    }
  }

  return isObject(value) && Array.isArray(value.citations) ? (value as Answer) : null
}

// Claude Code hands a mod one text block for an MCP result and no
// `structuredContent`. That block is either the structured result as JSON or
// the text the server writes for a person, so the mod reads both.
const GROUPS = { 'Your move': 'your_move', 'Awaiting others': 'waiting', Done: 'done' } as const

function parseLoops(text: string): Loops | null {
  const counts = /^(\d+) open · (\d+) your move · (\d+) awaiting others · (\d+) done/.exec(text)
  if (counts === null) return null

  const [open, yourMove, waiting, done] = counts.slice(1).map(Number) as [number, number, number, number]
  const loops: Loops = { your_move: [], waiting: [], done: [], counts: { open, your_move: yourMove, waiting, done } }
  let group: Loop[] | null = null
  let held: string | null = null

  for (const line of text.split('\n')) {
    const heading = /^(Your move|Awaiting others|Done) \(\d+\)$/.exec(line)?.[1] as keyof typeof GROUPS | undefined
    if (heading) {
      group = loops[GROUPS[heading]]
    } else if (line.startsWith('- ')) {
      held = line.slice(2)
    } else if (line.startsWith('  id: ') && group !== null && held !== null) {
      group.push({ id: line.slice(6), text: held, looksDone: held.includes(' · looks done, confirm?') })
      held = null
    }
  }

  return loops
}

const day = (iso?: string | null) => (iso ? iso.slice(0, 10) : '')

// One loop of the structured result: the fields of the server's `TodoItem`
// that the pane shows.
type RawLoop = {
  id: string
  summary: string
  direction?: string
  status?: string
  counterpart_name?: string | null
  due_at?: string | null
  raised_at?: string | null
  raised?: { title: string; source: string; channel?: string | null }
  evidence?: string | null
  ayda_confident?: { summary?: string } | null
}

function toLoop(raw: RawLoop): Loop {
  const who = raw.counterpart_name ?? 'someone'
  const parts = [
    raw.summary,
    raw.direction === 'await' ? `waiting on ${who}` : `for ${who}`,
    raw.due_at ? `due ${day(raw.due_at)}` : '',
    raw.raised ? `raised in ${raw.raised.title} (${raw.raised.channel ?? raw.raised.source}, ${day(raw.raised_at) || 'date unknown'})` : '',
  ]

  return {
    id: raw.id,
    text: parts.filter(Boolean).join(' · '),
    looksDone: raw.status === 'looks_done',
    evidence: raw.evidence ?? undefined,
    reason: raw.ayda_confident?.summary,
  }
}

function readLoops(text: string): Loops | null {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    return parseLoops(text)
  }
  if (!isObject(value) || !isObject(value.counts)) return null

  const group = (list: unknown) => (Array.isArray(list) ? (list as RawLoop[]).map(toLoop) : [])

  return {
    your_move: group(value.your_move),
    waiting: group(value.waiting),
    done: group(value.done),
    counts: value.counts as Loops['counts'],
  }
}

async function findServer($: EngineInterface): Promise<string> {
  const own = await $.mcp.connect('ayda')
  if (own.isConnected) return own.server

  const tools = await $.tool.list()
  const other = tools.map(tool => /^mcp__(.*ayda.*)__open_loops$/i.exec(tool.name)?.[1]).find(Boolean)
  if (other) return other

  throw new Error(`Ayda is not connected (${own.message}). Use /mcp to sign in.`)
}

async function callAyda($: EngineInterface, tool: string, args: Record<string, unknown>) {
  const result = await $.mcp.call(await findServer($), tool, args)
  const text = result.content.find(block => block.type === 'text')?.text
  if (result.isError || text === undefined) throw new Error(text ?? `Ayda could not complete ${tool}.`)

  return text
}

// Auto mode has a verdict only for an action the model asked for. The mod's
// own call has no model request behind it, so auto mode refuses it until a
// permission rule allows the tool.
function explain(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  return /auto mode classifier/i.test(message)
    ? 'Auto mode cannot approve a call that the Ayda mod makes itself. Allow the Ayda tools open_loops and decide_open_loop in /permissions, then press Refresh.'
    : message
}

async function refresh($: EngineInterface) {
  try {
    let text = ''
    let loops: Loops | null = null
    for (const limit of GROUP_LIMITS) {
      text = await callAyda($, 'open_loops', { filter: 'all', limit })
      loops = readLoops(text)
      if (loops !== null) break
    }
    if (loops === null) throw new Error(`Ayda returned no open loops list. The result starts: ${text.slice(0, 60)}`)
    await update($, loopsState, () => ({ loops, error: null }))
  } catch (error) {
    await update($, loopsState, held => ({ ...held, error: explain(error) }))
  }
}

async function decide($: EngineInterface, loop: Loop, status: 'open' | 'done' | 'dismissed') {
  try {
    await callAyda($, 'decide_open_loop', { item_id: loop.id, status })
    $.ui.toast(`Ayda: marked ${status}: ${loop.text.split(' · ')[0]}`)
  } catch (error) {
    $.ui.toast(explain(error))
  }
  await refresh($)
}

const openPane = ($: EngineInterface) => $.ui.open({ id: PANE, title: PANE_TITLE, focus: true })

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'ayda-loops', description: 'Show your Ayda open loops in a pane' })

    // A headless run draws nothing, so it must not spend the member's Ayda calls.
    if ((await $.session.surface()) !== null) {
      void refresh($)
      $.clock.every(REFRESH_MS, () => void refresh($))
    }

    return next(e)
  })

  on('command.run', { command: 'ayda-loops' }, async $ => {
    await openPane($)
    await refresh($)
    const { loops, error } = await read($, loopsState)

    return { text: error ?? `Ayda: ${loops?.counts.your_move ?? 0} your move, ${loops?.counts.waiting ?? 0} waiting.` }
  })

  // `today` defaults to UTC on the server. The member's day is their own zone.
  on('tool.call', { tool: TODAY }, ($, e, next) =>
    'timezone' in e ? next(e) : next({ ...e, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone } as typeof e),
  )

  // A verdict the model recorded changes the list the band and the pane show.
  on('tool.call', { tool: DECIDE }, async ($, e, next) => {
    const ran = await next(e)
    void refresh($)

    return ran
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const { loops } = await read($, loopsState)
    if (e.props.hasSurvey || loops === null || loops.counts.open === 0) return next(e)

    const { Box, Button, Text } = $.ui.resolve(e)
    const looksDone = [...loops.your_move, ...loops.waiting].filter(loop => loop.looksDone).length

    return (
      <Box>
        <Text dimColor>
          Ayda · {loops.counts.your_move} your move · {loops.counts.waiting} waiting
          {looksDone > 0 ? ` · ${looksDone} look done` : ''}{' '}
        </Text>
        <Button key="open" label="Loops" onPress={() => void openPane($)} />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)
    const { loops, error } = await read($, loopsState)

    if (loops === null) return <Text dimColor>{error ?? 'Asking Ayda…'}</Text>

    const group = (name: string, title: string, list: Loop[], total: number) => (
      <Box flexDirection="column" marginTop={1}>
        <Text bold>
          {title} ({total})
        </Text>
        {total > list.length && <Text dimColor>The first {list.length} are shown. Ayda has the rest.</Text>}
        {list.length === 0 && <Text dimColor>Nothing here.</Text>}
        {list.map((loop, index) => (
          <Box flexDirection="column" marginTop={1}>
            <Text>{loop.text}</Text>
            {loop.evidence && <Text dimColor>“{loop.evidence}”</Text>}
            {loop.looksDone && (
              <Text color={WARNING}>Ayda thinks this is done. {loop.reason ?? 'Confirm it, or press Not done.'}</Text>
            )}
            {name === 'done' ? (
              <Box>
                <Button key={`${name}-${index}-open`} label="Reopen" onPress={() => void decide($, loop, 'open')} />
              </Box>
            ) : (
              <Box columnGap={1}>
                <Button key={`${name}-${index}-done`} label="Done" onPress={() => void decide($, loop, 'done')} />
                <Button
                  key={`${name}-${index}-dismissed`}
                  label="Dismiss"
                  onPress={() => void decide($, loop, 'dismissed')}
                />
                {loop.looksDone && (
                  <Button key={`${name}-${index}-open`} label="Not done" onPress={() => void decide($, loop, 'open')} />
                )}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    )

    return (
      <Box flexDirection="column">
        <Box columnGap={1}>
          <Text dimColor>
            {loops.counts.open} open · {loops.counts.done} done
          </Text>
          <Button key="refresh" label="Refresh" onPress={() => void refresh($)} />
        </Box>
        {error && <Text color={WARNING}>{error}</Text>}
        {group('move', 'Your move', loops.your_move, loops.counts.your_move)}
        {group('waiting', 'Awaiting others', loops.waiting, loops.counts.waiting)}
        {group('done', 'Done', loops.done, loops.counts.done)}
      </Box>
    )
  })

  on('ui.render', { component: 'ToolResult', props: { tool: ANSWERS } }, ($, e, next) => {
    const answer = e.props.isErrored ? null : readAnswer(e.props.output)
    if (answer === null) return next(e)

    const { Box, Link, Text } = $.ui.resolve(e)
    const assertions = answer.citations.flatMap(citation => citation.temporal_assertions ?? [])
    const status = answer.temporal?.status
    const shown = answer.citations.slice(0, CITATIONS_SHOWN)

    return (
      <Box flexDirection="column">
        <Text dimColor>
          Ayda · {answer.citations.length} sources · {shown.length} shown
          {status && status !== 'no_temporal_state' ? ` · ${status.replace(/_/g, ' ')}` : ''}
        </Text>
        {assertions.some(one => one.conflict_status === 'authority_conflict') && (
          <Text color={WARNING}>Two sources state different current values. Read both.</Text>
        )}
        {assertions.some(one => one.evidence_status === 'source_changed') && (
          <Text color={WARNING}>A quoted source changed after Ayda verified the quote.</Text>
        )}
        {shown.map((citation, index) => (
          <Box columnGap={1}>
            <Text dimColor>{index + 1}.</Text>
            {citation.url ? <Link href={citation.url} label={citation.title} /> : <Text>{citation.title}</Text>}
            <Text dimColor>
              {citation.source}
              {citation.started_at ? ` · ${day(citation.started_at)}` : ''}
            </Text>
          </Box>
        ))}
      </Box>
    )
  })
}
