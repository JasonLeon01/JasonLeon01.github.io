import { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type LudorkContentProps = {
  /** e.g. "Ludork/README.md" or "Ludork/docs/en_GB/01.Introduction.md" */
  path: string | null
  /** Called when the user clicks a relative .md link inside the rendered document. */
  onNavigate?: (targetPath: string) => void
}

/** Derive the directory prefix for the current document (e.g. "Ludork/" from "Ludork/README.md"). */
function dirOf(docPath: string): string {
  const i = docPath.lastIndexOf('/')
  return i === -1 ? '' : docPath.slice(0, i + 1)
}

function encodeRepoPath(repoPath: string): string {
  return repoPath.split('/').map(encodeURIComponent).join('/')
}

export default function LudorkContent({ path, onNavigate }: LudorkContentProps) {
  const [md, setMd] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadMarkdown(): Promise<void> {
      if (!path) {
        setMd(null)
        return
      }

      setLoading(true)
      setError(null)
      setMd(null)

      const repoPath = path.slice('Ludork/'.length)

      try {
        const res = await fetch(`https://raw.githubusercontent.com/JasonLeon01/Ludork/main/${encodeRepoPath(repoPath)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        if (!cancelled) {
          setMd(text)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err))
          setLoading(false)
        }
      }
    }

    void loadMarkdown()

    return () => {
      cancelled = true
    }
  }, [path])

  if (!path) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="h6">Select a document from the sidebar</Typography>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}>
        <Typography variant="h6">Failed to load document</Typography>
        <Typography variant="body2">{error}</Typography>
      </Box>
    )
  }

  return (
    <Box className="ludork-markdown" sx={{ px: { xs: 2, md: 4 }, py: 3, maxWidth: 900 }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...rest }) {
            // Resolve relative links against the current doc's directory
            if (href && !/^(https?:|\/|#|mailto:)/.test(href) && path) {
              const resolved = dirOf(path) + href
              return (
                <a
                  href={`/${resolved}`}
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate?.(resolved)
                  }}
                  {...rest}
                >
                  {children}
                </a>
              )
            }
            return <a href={href} {...rest}>{children}</a>
          },
        }}
      >
        {md!}
      </ReactMarkdown>
    </Box>
  )
}
