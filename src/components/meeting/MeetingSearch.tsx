/**
 * MeetingSearch - 搜索栏组件
 */
import { Paper, InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface MeetingSearchProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
}

export default function MeetingSearch({
  value,
  onChange,
  onSearch,
  placeholder = '搜索会议...',
}: MeetingSearchProps) {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(value)
    }
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 0.5,
        borderRadius: 2,
        width: { xs: '100%', sm: 400 },
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
      elevation={0}
    >
      <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{ flex: 1, fontSize: '14px' }}
      />
    </Paper>
  )
}
