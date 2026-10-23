import { Box } from '@mui/material'
import Markdown from 'react-markdown'

export default function MarkdownContent({ children }: { children: string }) {
  return (
    <Box
      sx={{
        fontSize: 'inherit',
        lineHeight: 1.8,
        overflowWrap: 'anywhere',
        '& p': { my: 0, '& + p': { mt: 2 } },
        '& ul, & ol': { my: 0, pl: 2.5 },
        '& li + li': { mt: 0.75 },
        '& a': { color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
      }}
    >
      <Markdown>{children}</Markdown>
    </Box>
  )
}
