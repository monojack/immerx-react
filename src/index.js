import { useState, useEffect, useCallback, useMemo } from 'react'
import { create as stateCreate } from '@immerx/state'

let state$
export function create(initialState, middleware) {
  state$ = stateCreate(initialState, middleware)
  return state$
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
  }, [innerState$])

  return [state, update]
}

export function noop() {}
export function identity(x) {
  return x
}

export default create
