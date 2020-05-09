import { useState, useEffect, useCallback, useMemo } from 'react'
import { create } from 'immerx'

let state$
export function createStore(initialState) {
  state$ = create(initialState)
}

export function useImmerx(lens) {
  const innerState$ = useMemo(() => {
    return lens == null ? state$ : state$.isolate(lens)
  }, [lens])

  const [state, setState] = useState(innerState$.value)

  const update = useCallback(
    function update(producer) {
      innerState$.update(producer)
    },
    [innerState$],
  )

  useEffect(() => {
    const sub = innerState$.subscribe({
      next: setState,
    })

    return () => sub.unsubscribe()
  }, [lens, innerState$])

  return [state, update]
}

export function noop() {}
export function identity(x) {
  return x
}
