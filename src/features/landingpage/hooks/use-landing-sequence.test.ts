import { renderHook, act } from '@testing-library/react'
import { useLandingSequence } from './use-landing-sequence'

describe('useLandingSequence', () => {
    beforeEach(() => {
        sessionStorage.clear()
        localStorage.clear()
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.clearAllMocks()
        vi.useRealTimers()
    })

    it('should show animation by default on first visit', () => {
        const { result } = renderHook(() => useLandingSequence())

        expect(result.current.showAnimation).toBe(true)
        expect(result.current.audioUnlocked).toBe(false)
    })

    it('should skip animation if sessionStorage skip flag is set', () => {
        sessionStorage.setItem('skipWelcomeAnimation', 'true')

        const { result } = renderHook(() => useLandingSequence())

        expect(result.current.showAnimation).toBe(false)
    })

    it('should skip animation if visited less than 1 hour ago', () => {
        const now = Date.now()
        // Set last visit to 30 mins ago
        localStorage.setItem('krackedDevs_lastWelcomeTime', (now - 30 * 60 * 1000).toString())

        const { result } = renderHook(() => useLandingSequence())

        expect(result.current.showAnimation).toBe(false)
    })

    it('should show animation if visited more than 1 hour ago', () => {
        const now = Date.now()
        // Set last visit to 2 hours ago
        localStorage.setItem('krackedDevs_lastWelcomeTime', (now - 120 * 60 * 1000).toString())

        const { result } = renderHook(() => useLandingSequence())

        expect(result.current.showAnimation).toBe(true)
    })

    it('should unlock audio and update localStorage when animation completes', () => {
        const { result } = renderHook(() => useLandingSequence())
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent')

        act(() => {
            result.current.handleAnimationComplete()
        })

        expect(result.current.showAnimation).toBe(false)
        // Should set timestamp
        expect(localStorage.getItem('krackedDevs_lastWelcomeTime')).toBeTruthy()
        // Should unlock audio
        expect(result.current.audioUnlocked).toBe(true)
        expect(dispatchSpy).toHaveBeenCalledWith(expect.any(CustomEvent))
        expect(dispatchSpy.mock.calls[0][0].type).toBe('unlockAudio')
    })
})
