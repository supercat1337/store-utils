// @ts-check

/**
 * Attaches an abort handler to an AbortSignal that calls the provided cleanup function when aborted.
 * If the signal is already aborted, cleanup is called immediately.
 *
 * @param {AbortSignal | undefined} signal - The abort signal (optional).
 * @param {() => void} cleanup - The cleanup function to call on abort.
 * @returns {() => void} - A function to remove the abort listener (no-op if signal not provided or already aborted).
 */
export function attachAbortSignal(signal, cleanup) {
    if (!signal) {
        return () => {};
    }
    if (signal.aborted) {
        cleanup();
        return () => {};
    }
    const handler = () => {
        cleanup();
    };
    signal.addEventListener('abort', handler);
    return () => {
        signal.removeEventListener('abort', handler);
    };
}
