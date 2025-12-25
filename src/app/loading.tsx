import React from 'react'

function loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-56 h-[3px] bg-white/20 overflow-hidden mb-2">
          <div className="h-full w-1/2 bg-white animate-pulse" />
        </div>
        <p className="text-xs tracking-widest text-white/70">
          LOADING
        </p>
      </div>
    </div>
  )
}

export default loading