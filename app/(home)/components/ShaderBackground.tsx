"use client";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

export default function ShaderBackground() {
  return (
    <ShaderGradientCanvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      pixelDensity={1.5}
      fov={45}
    >
      <ShaderGradient
        cDistance={6}
        cPolarAngle={90}
        animate="on"
        uSpeed={0.1}
        // color1="#f4a672"
        // color2="#f28bb0"
        // color3="#ffd98a"
        // brightness={0.9}
        grain="on"
        grainBlending={0.00001}
      />
    </ShaderGradientCanvas>
  );
}
