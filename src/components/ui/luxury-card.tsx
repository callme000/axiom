"use client";

import React, { useState, useEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";

// Type definitions
interface Particle {
  id: number;
  left: number;
  duration: number;
  opacity: number;
}

interface CardTransform {
  rotateX: number;
  rotateY: number;
  translateY: number;
  scale: number;
}

export function LuxuryCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [transform, setTransform] = useState<CardTransform>({
    rotateX: 0,
    rotateY: 0,
    translateY: 0,
    scale: 1,
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleId = useRef<number>(0);
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const rippleId = useRef<number>(0);

  // 3D Transform Logic
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = (y / rect.height) * -10; // More subtle for forms
    const rotateY = (x / rect.width) * 10;

    setTransform({
      rotateX,
      rotateY,
      translateY: -10,
      scale: 1.01,
    });
  };

  const handleMouseLeave = (): void => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      translateY: 0,
      scale: 1,
    });
  };

  // Click Ripple Logic
  const handleCardClick = (e: MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = 60;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { id: rippleId.current++, x, y };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((current) => current.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  // Particle System
  useEffect(() => {
    const interval = setInterval(() => {
      const newParticle: Particle = {
        id: particleId.current++,
        left: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.3 + 0.1,
      };

      setParticles((prev) => [...prev, newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, newParticle.duration * 1000);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const transformStyle = `perspective(1000px) translateY(${transform.translateY}px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className={`relative rounded-[3rem] backdrop-blur-3xl transition-all duration-500 transform-gpu preserve-3d border border-white/5 bg-white/2 shadow-2xl ${className}`}
      style={{
        transform: transformStyle,
        animation: "luxury-float 6s ease-in-out infinite",
      }}
    >
      {/* Particles Overlay */}
      <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none z-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-0.5 h-0.5 rounded-full bg-white/20"
            style={{
              left: `${particle.left}%`,
              opacity: particle.opacity,
              animation: `luxury-particle-float ${particle.duration}s linear infinite`,
            }}
          />
        ))}
      </div>

      {/* Ripples Overlay */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute w-15 h-15 rounded-full pointer-events-none bg-white/10 z-0"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}

      {/* Card Highlight */}
      <div className="absolute inset-0 bg-linear-to-br from-white/3 to-transparent pointer-events-none rounded-[3rem]" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">{children}</div>

      {/* Internal Styles */}
      <style jsx global>{`
        @keyframes luxury-float {
          0%,
          100% {
            transform: ${transformStyle} translateY(0px);
          }
          50% {
            transform: ${transformStyle} translateY(-8px);
          }
        }

        @keyframes luxury-particle-float {
          0% {
            transform: translateY(100%) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100%) scale(1);
            opacity: 0;
          }
        }

        @keyframes luxury-ripple {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
