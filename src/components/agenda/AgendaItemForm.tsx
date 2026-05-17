/**
 * AgendaItemForm - 议题编辑表单
 */
import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { AgendaItem, Participant } from '@/types'

interface AgendaItemFormProps {
  open: boolean
  agendaItem?: AgendaItem // 编辑时传入
  participants: Participant[]
  onSave: (item: Omit<AgendaItem, 'id' | 'order' | 'isCompleted' | 'createdAt'>) => void
  onCancel: () => void
}

export default function AgendaItemForm({
  open,
  agendaItem,
  participants,
  onSave,
  onCancel,
}: AgendaItemFormProps) {
  const [title, setTitle] = useState(agendaItem?.title || '')
  const [description, setDescription] = useState(agendaItem?.description || '')
  const [estimatedMinutes, setEstimatedMinutes] = useState(agendaItem?.estimatedMinutes || 15)
  const [ownerId, setOwnerId] = useState(agendaItem?.ownerId || '')
  
  const handleSave = () => {
    if (!title.trim()) return
    
    onSave({
      title: title.trim(),
      description,
      estimatedMinutes,
      ownerId: ownerId || participants[0]?.id || '',
    })
    
    // 重置表单
    setTitle('')
    setDescription('')
    setEstimatedMinutes(15)
    setOwnerId('')
  }
  
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{agendaItem ? '编辑议题' : '添加议题'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="议题标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          
          <TextField
            label="议题描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="预估时长（分钟）"
              type="number"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
              sx={{ width: 180 }}
              InputProps={{ inputProps: { min: 1, max: 120 } }}
            />
            
            <FormControl fullWidth>
              <InputLabel>负责人</InputLabel>
              <Select
                value={ownerId}
                label="负责人"
                onChange={(e) => setOwnerId(e.target.value)}
              >
                {participants.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={handleSave} variant="contained" disabled={!title.trim()}>
          {agendaItem ? '保存' : '添加'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
