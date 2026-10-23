import { AppBar, Select, Toolbar, Typography } from '@mui/material'
import { useLanguage } from '../useLanguage'

export default function TopBar() {
  const { language, setLanguage } = useLanguage()

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar
        sx={{
          width: { xs: '100%', md: '85%' },
          maxWidth: 1400,
          mx: 'auto',
          gap: 1,
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Typography component="h1" sx={{ m: 0, fontSize: { xs: 16, sm: 20 }, fontWeight: 700 }}>
          JasonLeon
        </Typography>
        <Select
          native
          size="small"
          value={language}
          onChange={(event) => {
            const nextLanguage = event.target.value
            if (nextLanguage === 'en' || nextLanguage === 'zh') setLanguage(nextLanguage)
          }}
          inputProps={{ 'aria-label': language === 'en' ? 'Language' : '语言' }}
          sx={{ flexShrink: 0, fontSize: 14 }}
        >
          <option value="en">English</option>
          <option value="zh">简体中文</option>
        </Select>
      </Toolbar>
    </AppBar>
  )
}
