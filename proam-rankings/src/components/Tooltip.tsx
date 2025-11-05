import { useState, useRef, useEffect } from "react";

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Tooltip({ content, children, className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (!triggerRef.current || !tooltipRef.current) return;
        
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 12;
        const gap = 8;

        // Calculate preferred position (above trigger, centered)
        let top = triggerRect.top - tooltipRect.height - gap;
        let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        let positionAbove = true;

        // Check if there's enough space above
        if (top < padding) {
          // Not enough space above, position below instead
          top = triggerRect.bottom + gap;
          positionAbove = false;
        }

        // Adjust horizontal position to stay within viewport
        if (left < padding) {
          left = padding;
        } else if (left + tooltipRect.width > viewportWidth - padding) {
          left = Math.max(padding, viewportWidth - tooltipRect.width - padding);
        }

        // Ensure tooltip doesn't go below viewport
        if (top + tooltipRect.height > viewportHeight - padding) {
          // If below would overflow, try above if we haven't already
          if (!positionAbove && triggerRect.top - tooltipRect.height - gap >= padding) {
            top = triggerRect.top - tooltipRect.height - gap;
            positionAbove = true;
          } else {
            // Force it to fit within viewport
            top = Math.max(padding, viewportHeight - tooltipRect.height - padding);
          }
        }

        // Final safety check - ensure tooltip stays within bounds
        top = Math.max(padding, Math.min(top, viewportHeight - tooltipRect.height - padding));
        left = Math.max(padding, Math.min(left, viewportWidth - tooltipRect.width - padding));

        setPosition({ top, left });
      });
    }
  }, [isVisible]);

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children || (
        <svg 
          className="w-4 h-4 text-neutral-400 hover:text-neutral-300 cursor-help" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-label="More information"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      )}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-xs text-white bg-neutral-900 rounded-lg shadow-lg border border-neutral-700 pointer-events-none animate-fade-in max-w-[300px]"
          style={position ? { 
            top: `${position.top}px`, 
            left: `${position.left}px`,
            maxWidth: 'min(300px, calc(100vw - 24px))'
          } : { visibility: 'hidden', position: 'fixed' }}
          role="tooltip"
        >
          <div className="whitespace-normal break-words">{content}</div>
        </div>
      )}
    </div>
  );
}

