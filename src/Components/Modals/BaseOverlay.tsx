// BaseOverlay.tsx
import React from 'react'

const BaseOverlay = ({
  handleOpen,
  isOpen,
}: {
  handleOpen?: () => void
  isOpen?: boolean
}) => {
  return (
    <div
      onClick={handleOpen}
      className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs animate-overlay-in transition-opacity duration-300 ease-out"
    />
  )
}

export default BaseOverlay