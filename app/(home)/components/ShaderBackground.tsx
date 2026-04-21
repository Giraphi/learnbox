"use client";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

export default function ShaderBackground() {
  return (
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      pixelDensity={1.5}
      fov={45}
    >
      <ShaderGradient cDistance={6} cPolarAngle={90} />
    </ShaderGradientCanvas>
  );
}
