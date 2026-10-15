// SideModal.tsx
import { useEffect, useState, type ReactNode } from 'react'
import BaseOverlay from './BaseOverlay'
import { IoClose } from 'react-icons/io5'

interface SideModalProps {
  isOpen: boolean
  onClose?: () => void
  children?: ReactNode
  minWidth?: string
  maxWidth?: string
}

const SideModal = ({
  isOpen,
  onClose,
  children,
  minWidth = '320px',
  maxWidth = '560px',
}: SideModalProps) => {
  const [shouldRender, setShouldRender] = useState(isOpen)

  // نفصل mount/unmount عن الحالة المرئية عشان أنيميشن الخروج ياخد وقته
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
    } else if (shouldRender) {
      const timeout = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isOpen, shouldRender])

  useEffect(() => {
    if (!shouldRender) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [shouldRender])

  if (!shouldRender) return null

  return (
    <div>
      <BaseOverlay handleToggler={onClose} isOpen={isOpen} />

      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={
          {
            '--sm-min-w': minWidth,
            '--sm-max-w': maxWidth,
          } as React.CSSProperties
        }
        className={`
          fixed top-0 bottom-0 end-0 z-50
          w-full max-w-full
          md:w-fit md:min-w-[var(--sm-min-w)] md:max-w-[var(--sm-max-w)]
          bg-card text-copy-primary border-s border-border shadow-2xl
          transition-transform duration-300 ease-in-out will-change-transform
          ${isOpen ? 'translate-x-0' : 'ltr:translate-x-full rtl:-translate-x-full'}
        `}
      >
        <button 
            className="p-3 rounded-full hover:bg-gray-200 transition-all"
            onClick={onClose}
        >
            <IoClose />
        </button>
        {children}
      </div>
    </div>
  )
}

export default SideModal