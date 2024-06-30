import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ModalProps = {
  open: boolean
  onClose: () => void
  content: React.ReactNode
  title: string
}

const Modal: React.FC<ModalProps> = ({ open, onClose, content, title }) => {
  return (
    <Dialog modal open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[428px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}

export default Modal
