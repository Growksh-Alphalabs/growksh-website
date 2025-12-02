import React from 'react'

export default function Button({ children, onClick, variant = 'primary', className = '' }) {
  return (
    <button className={`gk-btn gk-btn-${variant} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}
