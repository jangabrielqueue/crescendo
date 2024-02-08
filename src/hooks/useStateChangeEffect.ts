import { useRef, useEffect } from 'react'

export const useStateChangeEffect = <T,>(effect: () => void, states: T[]): void => {
  const previousStatesRef = useRef<T[]>(states)
  useEffect(() => {
    const areStatesEqual = states.every((state, index) => state === previousStatesRef.current[index])
    if (!areStatesEqual) {
      effect()
      previousStatesRef.current = [...states]
    }
  }, [states, effect])
}
