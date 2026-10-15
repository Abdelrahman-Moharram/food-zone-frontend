// BaseOverlay.tsx
import React from 'react'

const BaseOverlay = ({
  handleToggler,
  isOpen,
}: {
  handleToggler?: () => void
  isOpen?: boolean
}) => {
  return (
    <div
      onClick={handleToggler}
      className={`fixed inset-0 z-40 bg-shared-theme-copy/60
        transition-opacity duration-300 ease-in-out
        ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}

export default BaseOverlay