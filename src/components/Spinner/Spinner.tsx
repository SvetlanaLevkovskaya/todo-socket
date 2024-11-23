export const Spinner = ({
  size = 50,
  currentColor,
}: {
  size?: number
  className?: string
  currentColor?: boolean
}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ shapeRendering: 'crispEdges' }}
        className="animate-spin"
      >
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke={currentColor ? 'currentColor' : '#caccd1'}
          strokeWidth="8"
          r="35"
          strokeDasharray="164.93361431346415 56.97787143782138"
          transform="matrix(1,0,0,1,0,0)"
        />
      </svg>
    </div>
  )
}
