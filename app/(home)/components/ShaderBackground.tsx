"use client";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { useState } from "react";

export default function ShaderBackground() {
  const [initialUTime] = useState(() => Math.random() * 100);

  return (
    <ShaderGradientCanvas
      className="animate-in fade-in duration-500 delay-100 fill-mode-both"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
      pixelDensity={1.5}
      fov={45}
    >
      <ShaderGradient
        animate="on"
        brightness={1.1}
        cAzimuthAngle={180}
        cDistance={8}
        cPolarAngle={100}
        color1="#5606ff"
        color2="#fe8989"
        color3="#000000"
        envPreset="city"
        grain="off"
        lightType="3d"
        positionX={-0.5}
        positionY={0.5}
        positionZ={0}
        range="enabled"
        rangeStart={initialUTime}
        rangeEnd={initialUTime + 1000000}
        reflection={0.1}
        rotationX={0}
        rotationY={0}
        rotationZ={235}
        shader="defaults"
        type="waterPlane"
        uAmplitude={0}
        uDensity={1.1}
        uFrequency={5.5}
        uSpeed={0.1}
        uStrength={2.4}
        uTime={0}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  );
}
