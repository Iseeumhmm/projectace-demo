'use client'

import { Stream, type StreamPlayerApi } from '@cloudflare/stream-react'
import { v4 as uuidv4 } from 'uuid'

import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  playbackId: string
  poster?: string
  customerCode?: string
  autoplayInViewport?: boolean // NEW
  viewportThreshold?: number // 0..1, default 0.6
}

type WatchedRange = { start: number; end: number }

export default function VideoTracker({
  playbackId,
  poster,
  customerCode,
  autoplayInViewport = true,
  viewportThreshold = 0.25,
}: Props) {
  const streamRef = useRef<StreamPlayerApi>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [sessionId] = useState(() => uuidv4())
  const [startedAt] = useState(() => Date.now())
  const [duration, setDuration] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [userPaused, setUserPaused] = useState(false) // track manual pauses
  const [lastTime, setLastTime] = useState(0)
  const [watched, setWatched] = useState<WatchedRange[]>([])
  const [quartilesFired, setQuartilesFired] = useState({
    q25: false,
    q50: false,
    q75: false,
    q100: false,
  })
  const [viewerId, setViewerId] = useState<string | null>(null)
  const heartbeatMs = 5000

  useEffect(() => {
    if (typeof window === 'undefined') return // SSR/edge safety
    try {
      const key = 'viewerId'
      let v = window.localStorage.getItem(key)
      if (!v) {
        v = uuidv4()
        window.localStorage.setItem(key, v)
      }
      setViewerId(v)
    } catch {
      // Storage might be blocked; fall back to a session-scoped id
      setViewerId(uuidv4())
    }
  }, [])

  async function send(evt: string, extra: Record<string, any> = {}) {
    const player = streamRef.current
    const now = Date.now()
    const payload = {
      evt,
      sessionId,
      viewerId,
      playbackId,
      ts: now,
      sinceStartMs: now - startedAt,
      currentTime: player?.currentTime ?? null,
      duration,
      buffered: player?.buffered?.length
        ? player.buffered.end(player.buffered.length - 1)
        : null,
      visible: document.visibilityState,
      ...extra,
    }
    // fetch("/api/video-events", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) })
    //   .catch(() => {});
    console.log({ payload })
  }

  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(() => send('heartbeat'), heartbeatMs)
    return () => clearInterval(id)
  }, [isPlaying])

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden' && streamRef.current?.pause) {
        streamRef.current.pause()
      }
      send('visibilitychange')
    }
    window.addEventListener('visibilitychange', onVis)
    return () => window.removeEventListener('visibilitychange', onVis)
  }, [])

  function appendWatched(newStart: number, newEnd: number) {
    setWatched((prev) => {
      const merged = [...prev, { start: newStart, end: newEnd }].sort(
        (a, b) => a.start - b.start,
      )
      const compact: WatchedRange[] = []
      for (const r of merged) {
        const last = compact[compact.length - 1]
        if (last && r.start <= last.end + 0.5)
          last.end = Math.max(last.end, r.end)
        else compact.push({ ...r })
      }
      return compact
    })
  }

  const onLoadedMetaData: EventListener = () => {
    const d = streamRef.current?.duration ?? null
    if (d && !duration) setDuration(d)
    send('loadedmetadata')
  }
  const onPlay: EventListener = () => {
    setIsPlaying(true)
    setUserPaused(false)
    send('play')
  }
  const onPause: EventListener = () => {
    setIsPlaying(false)
    send('pause')
  }
  const onWaiting: EventListener = () => send('rebuffer_start')
  const onPlaying: EventListener = () => send('rebuffer_end')
  const onSeeked: EventListener = () => {
    const t = streamRef.current?.currentTime ?? 0
    send('seeked', { to: t, from: lastTime })
    setLastTime(t)
  }
  const onTimeUpdate: EventListener = () => {
    const t = streamRef.current?.currentTime ?? 0
    const d = duration ?? streamRef.current?.duration ?? 0
    appendWatched(lastTime, t)
    setLastTime(t)
    if (d > 0) {
      const pct = (t / d) * 100
      const q = quartilesFired
      if (!q.q25 && pct >= 25) {
        setQuartilesFired({ ...q, q25: true })
        send('quartile', { quartile: 25 })
      }
      if (!q.q50 && pct >= 50) {
        setQuartilesFired({ ...q, q50: true })
        send('quartile', { quartile: 50 })
      }
      if (!q.q75 && pct >= 75) {
        setQuartilesFired({ ...q, q75: true })
        send('quartile', { quartile: 75 })
      }
      if (!q.q100 && pct >= 99.5) {
        setQuartilesFired({ ...q, q100: true })
        send('quartile', { quartile: 100 })
      }
    }
  }
  const onEnded: EventListener = () => {
    appendWatched(lastTime, streamRef.current?.duration ?? 0)
    send('ended', { watched })
  }

  // --- NEW: Autoplay while in viewport ---
  useEffect(() => {
    if (!autoplayInViewport) return
    if (!containerRef.current) return

    // Respect prefers-reduced-motion: don't autoplay
    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    )?.matches
    if (prefersReduced) return

    const io = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0]
        const player = streamRef.current
        if (!player) return

        // Make sure the player is allowed to autoplay: keep it muted initially.
        try {
          // Some environments expose 'muted' on the API; if not, pass 'muted' prop below.
          if (typeof (player as any).muted === 'boolean')
            (player as any).muted = true
        } catch {}

        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= viewportThreshold
        ) {
          if (!userPaused) {
            try {
              await player.play()
              player.muted = false
            } catch {
              /* autoplay may still be blocked on some platforms */
            }
          }
        } else {
          try {
            await player.pause()
          } catch {}
        }
      },
      { threshold: [0, viewportThreshold], root: null, rootMargin: '0px' },
    )

    io.observe(containerRef.current)
    return () => io.disconnect()
  }, [autoplayInViewport, viewportThreshold, userPaused])

  // If user manually clicks pause on the controls, remember that so we don't auto-resume.
  // (We already set userPaused=false in onPlay.)
  const onUserPause = () => {
    setUserPaused(true)
    onPause(new Event('pause'))
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-screen-lg mx-auto">
      <Stream
        src={playbackId}
        poster={poster}
        controls
        responsive
        // Key autoplay settings:
        // muted    // important: muted autoplay is allowed
        muted={false}
        customerCode={customerCode}
        streamRef={streamRef as any}
        onLoadedMetaData={onLoadedMetaData}
        onPlay={onPlay}
        onPause={onUserPause}
        onWaiting={onWaiting}
        onPlaying={onPlaying}
        onSeeked={onSeeked}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        onError={() => send('error')}
      />
      {/* Optional: small unmute helper for UX */}
      {/* <button
        type="button"
        className="absolute bottom-3 right-3 rounded-xl bg-black/60 text-white text-sm px-3 py-1"
        onClick={() => {
          const p = streamRef.current as any;
          if (!p) return;
          try { p.muted = false; } catch {}
        }}
      >
        Unmute
      </button> */}
    </div>
  )
}
