// Animated background particles component - reusable across all pages

const floatingStyles = `
  @keyframes float1 {
    0% { transform: translate(0, 0); }
    25% { transform: translate(30px, -30px); }
    50% { transform: translate(0, -60px); }
    75% { transform: translate(-30px, -30px); }
    100% { transform: translate(0, 0); }
  }
  @keyframes float2 {
    0% { transform: translate(0, 0); }
    25% { transform: translate(-40px, 20px); }
    50% { transform: translate(-20px, 50px); }
    75% { transform: translate(40px, 20px); }
    100% { transform: translate(0, 0); }
  }
  @keyframes float3 {
    0% { transform: translate(0, 0); }
    25% { transform: translate(50px, 30px); }
    50% { transform: translate(30px, -40px); }
    75% { transform: translate(-50px, -20px); }
    100% { transform: translate(0, 0); }
  }
  @keyframes float4 {
    0% { transform: translate(0, 0); }
    25% { transform: translate(-30px, -50px); }
    50% { transform: translate(40px, -30px); }
    75% { transform: translate(20px, 40px); }
    100% { transform: translate(0, 0); }
  }
  @keyframes float5 {
    0% { transform: translate(0, 0); }
    25% { transform: translate(40px, 40px); }
    50% { transform: translate(-30px, 50px); }
    75% { transform: translate(-40px, -30px); }
    100% { transform: translate(0, 0); }
  }
  .particle1 { animation: float1 8s ease-in-out infinite; }
  .particle2 { animation: float2 10s ease-in-out infinite; }
  .particle3 { animation: float3 12s ease-in-out infinite; }
  .particle4 { animation: float4 9s ease-in-out infinite; }
  .particle5 { animation: float5 11s ease-in-out infinite; }
`;

export const AnimatedParticles = () => {
  return (
    <>
      <style>{floatingStyles}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle1 absolute top-20 right-10 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
        <div className="particle2 absolute top-40 left-20 w-1 h-1 bg-emerald-400 rounded-full animate-pulse opacity-60"></div>
        <div className="particle3 absolute bottom-20 right-32 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>
        <div className="particle4 absolute top-1/3 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-60"></div>
        <div className="particle5 absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse opacity-50"></div>
      </div>
    </>
  );
};
