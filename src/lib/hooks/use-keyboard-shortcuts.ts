import { useEffect } from 'react'

export function useKeyboardShortcuts(callbacks: {
  onNewProject?: () => void
  onSave?: () => void
  onRunPipeline?: () => void
  onPublish?: () => void
  onSearch?: () => void
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault()
            callbacks.onNewProject?.()
            break
          case 's':
            e.preventDefault()
            callbacks.onSave?.()
            break
          case 'r':
            e.preventDefault()
            callbacks.onRunPipeline?.()
            break
          case 'p':
            e.preventDefault()
            callbacks.onPublish?.()
            break
          case 'k':
            e.preventDefault()
            callbacks.onSearch?.()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [callbacks])
}
