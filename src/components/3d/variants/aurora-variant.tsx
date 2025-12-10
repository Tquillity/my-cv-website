"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import { ShaderMaterial, Color, AdditiveBlending, DoubleSide } from "three";

// Improved Noise Function
const simplexNoise = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const AuroraShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform vec3 color3;
    varying vec2 vUv;
    
    ${simplexNoise}
    
    void main() {
      // Stretch UVs to make curtains
      vec2 uv = vUv * vec2(1.0, 4.0);
      
      // Moving noise layers
      float n1 = snoise(uv + vec2(0.0, time * 0.1));
      float n2 = snoise(uv * 1.5 - vec2(0.0, time * 0.15));
      
      // Create the "curtain" wave effect
      float wave = sin(vUv.x * 10.0 + time + n1 * 2.0) * 0.5 + 0.5;
      
      // Bottom fade out
      float alpha = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.6, 1.0, vUv.y));
      
      // Combine
      float intensity = (n1 * 0.5 + n2 * 0.5) * wave * alpha;
      
      // Color mixing
      vec3 finalColor = mix(color1, color2, vUv.y);
      finalColor = mix(finalColor, color3, wave);
      
      gl_FragColor = vec4(finalColor, intensity * 0.8);
    }
  `,
};

export const AuroraVariant: React.FC<{ theme?: 'light' | 'middle' | 'dark' }> = ({ theme = 'dark' }) => {
  const materialRef = useRef<ShaderMaterial>(null);
  
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Realistic Aurora colors - darker for light mode, bright for middle/dark
  const colors = useMemo(() => {
    if (theme === 'light') {
      // Darker colors for light mode
      return {
        c1: new Color("#00cc6a"), // Darker Green/Teal
        c2: new Color("#4a1fcc"), // Darker Purple/Violet
        c3: new Color("#00a8cc"), // Darker Blue
      };
    } else {
      // Bright colors for middle and dark modes
      return {
        c1: new Color("#00ff87"), // Bright Green/Teal
        c2: new Color("#6028ff"), // Deep Purple/Violet
        c3: new Color("#00d4ff"), // Soft Blue
      };
    }
  }, [theme]);

  useFrame((state) => {
    if (materialRef.current && !prefersReducedMotion) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <group position={[0, 0, -20]} rotation={[0.3, 0, 0]}>
      {/* Much larger plane to cover entire viewport without clipping */}
      <Plane args={[100, 100, 128, 128]}>
        <shaderMaterial
          ref={materialRef}
          args={[AuroraShader]}
          uniforms={{
            time: { value: 0 },
            color1: { value: colors.c1 },
            color2: { value: colors.c2 },
            color3: { value: colors.c3 },
          }}
          transparent
          side={DoubleSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </Plane>
    </group>
  );
};
