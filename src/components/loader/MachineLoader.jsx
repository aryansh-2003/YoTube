export default function MachineLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen backdrop-blur-xl">
      <div className="relative w-12 h-12">
        {/* Main rotating square */}
        <div className="absolute inset-0 bg-white animate-spin-reverse" 
             style={{ animationDuration: '1s', animationTimingFunction: 'ease-in-out' }}>
          {/* Rotated square layer */}
          <div className="absolute inset-0 bg-gray-200 transform rotate-45 shadow-md"></div>
        </div>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md"></div>
      </div>
      
      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}