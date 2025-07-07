import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface MarasilAtomLogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
  rotationSpeed?: number;
}

export function MarasilAtomLogo({ 
  className = "", 
  size = 400, 
  animated = true,
  rotationSpeed = 20 // Default whole logo rotation speed in seconds (no longer used)
}: MarasilAtomLogoProps) {
  const [isClient, setIsClient] = useState(false);
  
  // Viewbox dimensions
  const viewBoxSize = 300;
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Server-side rendering fallback
  if (!isClient) {
    return <div className={className} style={{ width: size, height: size }} />;
  }

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: size, height: size }}
    >
      {/* Main 3D container - static with 3D perspective */}
      <motion.div
        initial={{ 
          rotateX: 10 // Slight tilt on X axis for better 3D effect
        }}
        style={{ 
          width: size, 
          height: size,
          transformStyle: "preserve-3d",
          transformPerspective: 1200,
          transform: "translateZ(0)",
          rotateX: "10deg" // Fixed tilt for 3D appearance
        }}
        className="relative"
      >
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            transformStyle: "preserve-3d",
            position: "relative"
          }}
        >
          {/* Orbit 1 - Horizontal ellipse with individual rotation */}
          <motion.g
            initial={animated ? { opacity: 0, rotate: 0 } : undefined}
            animate={animated ? { 
              opacity: 1, 
              rotate: 360,
              transformOrigin: "center"
            } : undefined}
            transition={{
              opacity: { duration: 0.5 },
              rotate: { 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear" 
              }
            }}
          >
            <ellipse
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              rx={viewBoxSize * 0.45}
              ry={viewBoxSize * 0.20}
              stroke="#0F2F55"
              strokeWidth={12}
              fill="none"
              style={{
                filter: "drop-shadow(0 0 2px rgba(15, 47, 85, 0.3))"
              }}
            />
            
            {/* Electron 1 - attached to Orbit 1 */}
            <motion.circle
              cx={viewBoxSize / 2 + viewBoxSize * 0.45}
              cy={viewBoxSize / 2}
              r={viewBoxSize * 0.025}
              fill="#3B82F6"
              initial={animated ? { scale: 0, opacity: 0 } : undefined}
              animate={animated ? { scale: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{
                filter: "drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))"
              }}
            />
          </motion.g>
          
          {/* Orbit 2 - Diagonal ellipse 1 with individual rotation */}
          <motion.g
            initial={animated ? { opacity: 0, rotate: 60 } : undefined}
            animate={animated ? { 
              opacity: 1, 
              rotate: [60, 420],
              transformOrigin: "center"
            } : undefined}
            transition={{
              opacity: { duration: 0.5 },
              rotate: { 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }
            }}
          >
            <ellipse
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              rx={viewBoxSize * 0.45}
              ry={viewBoxSize * 0.20}
              stroke="#0F2F55"
              strokeWidth={12}
              fill="none"
              style={{
                filter: "drop-shadow(0 0 2px rgba(15, 47, 85, 0.3))"
              }}
            />
            
            {/* Electron 2 - attached to Orbit 2 */}
            <motion.circle
              cx={viewBoxSize / 2 - viewBoxSize * 0.45}
              cy={viewBoxSize / 2}
              r={viewBoxSize * 0.025}
              fill="#3B82F6"
              initial={animated ? { scale: 0, opacity: 0 } : undefined}
              animate={animated ? { scale: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{
                filter: "drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))"
              }}
            />
          </motion.g>
          
          {/* Orbit 3 - Diagonal ellipse 2 with individual rotation */}
          <motion.g
            initial={animated ? { opacity: 0, rotate: 120 } : undefined}
            animate={animated ? { 
              opacity: 1, 
              rotate: [120, 480],
              transformOrigin: "center"
            } : undefined}
            transition={{
              opacity: { duration: 0.5 },
              rotate: { 
                duration: 50, 
                repeat: Infinity, 
                ease: "linear" 
              }
            }}
          >
            <ellipse
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              rx={viewBoxSize * 0.45}
              ry={viewBoxSize * 0.20}
              stroke="#0F2F55"
              strokeWidth={12}
              fill="none"
              style={{
                filter: "drop-shadow(0 0 2px rgba(15, 47, 85, 0.3))"
              }}
            />
            
            {/* Electron 3 - attached to Orbit 3 */}
            <motion.circle
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2 - viewBoxSize * 0.20}
              r={viewBoxSize * 0.025}
              fill="#3B82F6"
              initial={animated ? { scale: 0, opacity: 0 } : undefined}
              animate={animated ? { scale: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.5, delay: 1 }}
              style={{
                filter: "drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))"
              }}
            />
          </motion.g>
          
          {/* Orbit 4 - Diagonal ellipse 3 with individual rotation */}
          <motion.g
            initial={animated ? { opacity: 0, rotate: 150 } : undefined}
            animate={animated ? { 
              opacity: 1, 
              rotate: [150, 510],
              transformOrigin: "center"
            } : undefined}
            transition={{
              opacity: { duration: 0.5 },
              rotate: { 
                duration: 45, 
                repeat: Infinity, 
                ease: "linear" 
              }
            }}
          >
            <ellipse
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              rx={viewBoxSize * 0.45}
              ry={viewBoxSize * 0.20}
              stroke="#0F2F55"
              strokeWidth={12}
              fill="none"
              style={{
                filter: "drop-shadow(0 0 2px rgba(15, 47, 85, 0.3))"
              }}
            />
            
            {/* Electron 4 - attached to Orbit 4 */}
            <motion.circle
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2 + viewBoxSize * 0.20}
              r={viewBoxSize * 0.025}
              fill="#3B82F6"
              initial={animated ? { scale: 0, opacity: 0 } : undefined}
              animate={animated ? { scale: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.5, delay: 0.9 }}
              style={{
                filter: "drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))"
              }}
            />
          </motion.g>
          
          {/* Central nucleus sphere with 3D effect - NO ROTATION */}
          <motion.g
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "center",
            }}
          >
            {/* Outer glow for 3D effect */}
            <motion.circle
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              r={viewBoxSize * 0.24}
              fill="url(#nucleus-gradient)"
              initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
              animate={animated ? { scale: 1, opacity: 0.6 } : undefined}
              transition={{ duration: 0.5 }}
              style={{
                filter: "blur(10px)",
              }}
            />
            
            {/* Main nucleus */}
            <motion.circle
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              r={viewBoxSize * 0.22}
              fill="url(#sphere-gradient)"
              initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
              animate={animated ? { scale: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.5 }}
              style={{
                filter: "drop-shadow(0 10px 15px rgba(15, 47, 85, 0.6))",
              }}
            />
          
            {/* Letter M in the center - with 3D effect */}
            <motion.path
              d="M120 175 L120 125 L150 155 L180 125 L180 175"
              stroke="white"
              strokeWidth={14}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
              animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))",
              }}
            />
          </motion.g>
          
          {/* Gradients for 3D effects */}
          <defs>
            <radialGradient
              id="sphere-gradient"
              cx="35%"
              cy="35%"
              r="65%"
              fx="25%"
              fy="25%"
            >
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#0F2F55" />
              <stop offset="100%" stopColor="#0B1A2E" />
            </radialGradient>
            
            <radialGradient
              id="nucleus-gradient"
              cx="50%"
              cy="50%"
              r="65%"
            >
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0F2F55" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
      
      {/* Enhanced 3D glow effect */}
      {animated && (
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ 
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(15,47,85,0.08) 50%, rgba(0,0,0,0) 70%)",
            filter: "blur(20px)",
          }}
        />
      )}
    </div>
  );
}