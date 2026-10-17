import React, { ReactNode } from 'react'
import { Badge } from '../../../Components/Common/Badges'

interface PolicyPointProps {
  title       : string
  description : string
  icon?       : ReactNode
  badge?      : ReactNode
}

const PolicyPoint = ({ title, description, icon, badge }: PolicyPointProps) => {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border/70">
      {icon && (
        <div className="p-2 rounded-lg bg-container border border-border/60 text-primary shrink-0 mt-0.5 text-base">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h5 className="font-bold text-sm text-color">{title}</h5>
          {badge && (
            <Badge variant="primary">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-xs text-color/80 leading-relaxed font-normal">{description}</p>
      </div>
    </div>
  )
}

export default PolicyPoint
