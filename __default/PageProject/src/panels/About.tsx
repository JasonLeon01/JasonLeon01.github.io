import { Box } from '@mui/material'
import InfoSection from '../components/InfoSection'
import MarkdownContent from '../components/MarkdownContent'
import { infoByLanguage } from '../info'
import { useLanguage } from '../useLanguage'

export default function AboutPanel() {
  const { language } = useLanguage()

  return (
    <InfoSection>
      <Box sx={{ fontSize: 16, color: 'text.primary', fontFamily: 'Georgia, Times, serif', '& p': { textIndent: '1.6em' } }}>
        <MarkdownContent>{infoByLanguage[language].about}</MarkdownContent>
      </Box>
    </InfoSection>
  )
}
