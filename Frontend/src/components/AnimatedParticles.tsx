// Subtle ambient background — minimal floating gradient orbs
export const AnimatedParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)', animation: 'float-slow 20s ease-in-out infinite' }}
      />
      <div
        className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', animation: 'float-slow 25s ease-in-out infinite reverse' }}
      />
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
      `}</style>
    </div>
  );
};
