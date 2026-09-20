"use client";

const particles = Array.from({ length: 45 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i * 0.37) % 8}s`,
  duration: `${6 + ((i * 1.13) % 7)}s`,
  size: `${2 + (i % 3)}px`,
}));

export default function FallingParticles() {
  return (
    <div className="imc-particles" aria-hidden="true">
      {particles.map((particle, index) => (
        <span
          key={index}
          className="imc-particle"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}
