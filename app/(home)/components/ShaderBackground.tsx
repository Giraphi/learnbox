"use client";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { useEffect, useState } from "react";

export default function ShaderBackground() {
  const [isShaderVisible, setIsShaderVisible] = useState(false);

  useEffect(function fadeInAfterShaderMount() {
    const rafId = requestAnimationFrame(() => {
      setIsShaderVisible(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <ShaderGradientCanvas
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: isShaderVisible ? 1 : 0,
        transition: "opacity 400ms ease-out",
      }}
      pixelDensity={1.5}
      fov={30}
    >
      <ShaderGradient
        cDistance={12}
        cPolarAngle={90}
        animate="on"
        uSpeed={0.5}
        color1="#aaa"
        color2="#111"
        brightness={0.8}
        envPreset="dawn"
      />
    </ShaderGradientCanvas>
  );
}
