"use client";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

export default function ShaderBackground() {
  return (
    <ShaderGradientCanvas
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
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
