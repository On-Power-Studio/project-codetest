import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAxiomStore } from '../store/axiomStore';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ZoomIn, ZoomOut, RotateCcw, Radio, Layers, Activity, Cpu } from 'lucide-react';

type XYZ = [number, number, number];

// ============================================================
//  WINDOW GRID TEXTURE — canvas-generated emissive windows
// ============================================================
function makeWindowTexture(color: string, cols = 6, rows = 12): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#03080f';
  ctx.fillRect(0, 0, 128, 256);
  const pw = 128 / cols; const ph = 256 / rows;
  for (let r = 0; r < rows; r++) {
    for (let cl = 0; cl < cols; cl++) {
      const lit = Math.random() > 0.25;
      if (lit) {
        ctx.fillStyle = color + 'cc';
        ctx.fillRect(cl * pw + 2, r * ph + 2, pw - 4, ph - 4);
        // inner brighter core
        ctx.fillStyle = '#ffffff44';
        ctx.fillRect(cl * pw + pw * 0.25, r * ph + ph * 0.25, pw * 0.5, ph * 0.5);
      }
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ============================================================
//  BUILDING WITH WINDOW GRID
// ============================================================
interface BuildingProps {
  pos: XYZ; w: number; d: number; h: number; color: string; riseDelay?: number;
}
const Building: React.FC<BuildingProps> = ({ pos, w, d, h, color, riseDelay = 0 }) => {
  const [rh, setRh] = useState(0.001);
  useEffect(() => {
    const t0 = performance.now() + riseDelay * 1000;
    let id: number;
    const tick = (now: number) => {
      if (now < t0) { id = requestAnimationFrame(tick); return; }
      const p = Math.min((now - t0) / 1100, 1);
      setRh(1 - Math.pow(1 - p, 4));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [riseDelay]);

  const ah = h * rh;
  const winTex = useMemo(() => makeWindowTexture(color), [color]);
  const colObj = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group position={[pos[0], 0, pos[2]]}>
      {/* Core body with window texture */}
      <mesh position={[0, ah / 2, 0]} castShadow>
        <boxGeometry args={[w, ah, d]} />
        <meshStandardMaterial
          color="#020710" roughness={0.05} metalness={0.98}
          emissiveMap={winTex} emissive={colObj} emissiveIntensity={0.55}
        />
      </mesh>
      {/* Outer edge halo */}
      <mesh position={[0, ah / 2, 0]}>
        <boxGeometry args={[w + 0.006, ah + 0.006, d + 0.006]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.BackSide}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Horizontal accent bands */}
      {ah > 0.25 && [0.25, 0.5, 0.78].map((f, i) => (
        <mesh key={i} position={[0, ah * f, 0]}>
          <boxGeometry args={[w + 0.012, 0.014, d + 0.012]} />
          <meshBasicMaterial color={color} transparent opacity={0.65 - i * 0.1}
            blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      {/* Roof cap glow */}
      {rh > 0.88 && (
        <mesh position={[0, ah + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w * 0.85, d * 0.85]} />
          <meshBasicMaterial color={color} transparent opacity={0.4}
            blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
};

// ============================================================
//  MULTI-LANE ROAD SEGMENT (with micro lane lines)
// ============================================================
interface RoadProps {
  p1: XYZ; p2: XYZ;
  color?: string;
  width?: number;
  bright?: boolean;
  lanes?: number;
}
const MultiLaneRoad: React.FC<RoadProps> = ({
  p1, p2, color = '#f59e0b', width = 0.32, bright = false, lanes = 4
}) => {
  const mid: XYZ = [(p1[0] + p2[0]) / 2, 0.005, (p1[2] + p2[2]) / 2];
  const dx = p2[0] - p1[0]; const dz = p2[2] - p1[2];
  const len = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);

  const lanePositions = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < lanes; i++) {
      positions.push(-width / 2 + (i / (lanes - 1)) * width);
    }
    return positions;
  }, [width, lanes]);

  return (
    <group position={mid} rotation={[0, angle, 0]}>
      {/* Road bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.003, 0]}>
        <planeGeometry args={[width * 1.15, len]} />
        <meshBasicMaterial color="#030a14" transparent opacity={0.98} />
      </mesh>
      {/* Under-glow (road surface emission) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
        <planeGeometry args={[width * 0.9, len]} />
        <meshBasicMaterial color={color} transparent opacity={bright ? 0.18 : 0.07}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Micro lane lines */}
      {lanePositions.map((xpos, i) => {
        const isEdge = i === 0 || i === lanes - 1;
        const isCenter = i === Math.floor(lanes / 2) - 1 || i === Math.floor(lanes / 2);
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[xpos, 0.001, 0]}>
            <planeGeometry args={[isEdge ? 0.022 : 0.008, len]} />
            <meshBasicMaterial
              color={isEdge ? color : (isCenter ? '#ffffff' : color)}
              transparent
              opacity={isEdge ? (bright ? 0.95 : 0.65) : (isCenter ? 0.3 : 0.2)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
      {/* Dashed center marker */}
      {Array.from({ length: Math.floor(len / 0.55) }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.002, -len / 2 + i * 0.55 + 0.18]}>
          <planeGeometry args={[0.028, 0.22]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.25}
            blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

// ============================================================
//  ROAD JUNCTION WITH MULTI-RING
// ============================================================
const RoadJunction: React.FC<{ pos: XYZ; color?: string; r?: number }> = ({
  pos, color = '#f59e0b', r = 0.55
}) => {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  const r4 = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (r1.current) r1.current.rotation.z = t * 0.55;
    if (r2.current) r2.current.rotation.z = -t * 1.05;
    if (r3.current) r3.current.rotation.z = t * 0.3;
    if (r4.current) r4.current.rotation.z = -t * 0.7;
  });
  return (
    <group position={[pos[0], 0.01, pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Filled disc glow */}
      <mesh>
        <circleGeometry args={[r, 40]} />
        <meshBasicMaterial color={color} transparent opacity={0.06}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Outer ring full */}
      <mesh>
        <ringGeometry args={[r * 0.96, r * 1.0, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Spinning arcs */}
      <mesh ref={r1}>
        <ringGeometry args={[r * 0.74, r * 0.82, 40, 1, 0, Math.PI * 1.65]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={r2}>
        <ringGeometry args={[r * 0.5, r * 0.56, 16, 1, 0, Math.PI * 0.7]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={r3}>
        <ringGeometry args={[r * 0.28, r * 0.33, 8, 1, 0, Math.PI * 1.1]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={r4}>
        <ringGeometry args={[r * 1.12, r * 1.16, 24, 1, 0, Math.PI * 0.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Center dot */}
      <mesh>
        <circleGeometry args={[r * 0.08, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// ============================================================
//  WARNING TRIANGLE
// ============================================================
const WarningMarker: React.FC<{ pos: XYZ; color?: string }> = ({ pos, color = '#ef4444' }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ref.current) {
      const t = s.clock.getElapsedTime();
      ref.current.position.y = 0.3 + Math.sin(t * 2.5) * 0.05;
    }
  });
  const tri = useMemo(() => {
    const sh = new THREE.Shape();
    sh.moveTo(0, 0.2); sh.lineTo(0.17, -0.1); sh.lineTo(-0.17, -0.1); sh.closePath();
    return sh;
  }, []);
  return (
    <group ref={ref} position={[pos[0], 0.3, pos[2]]}>
      <mesh>
        <shapeGeometry args={[tri]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0.025, 0.001]}>
        <boxGeometry args={[0.025, 0.11, 0.001]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
      <mesh position={[0, -0.075, 0.001]}>
        <boxGeometry args={[0.025, 0.025, 0.001]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
};

// ============================================================
//  HOLOGRAPHIC DISC
// ============================================================
const HoloDisk: React.FC<{ pos: XYZ; color?: string; h?: number }> = ({
  pos, color = '#8B5CF6', h = 1.2
}) => {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const r3 = useRef<THREE.Mesh>(null);
  const grp = useRef<THREE.Group>(null);
  useFrame((s) => {
    const t = s.clock.getElapsedTime();
    if (r1.current) r1.current.rotation.z = t * 1.3;
    if (r2.current) r2.current.rotation.z = -t * 0.85;
    if (r3.current) r3.current.rotation.z = t * 0.5;
    if (grp.current) grp.current.position.y = h + Math.sin(t * 1.6) * 0.07;
  });
  return (
    <group ref={grp} position={[pos[0], h, pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <circleGeometry args={[0.38, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.06}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={r1}>
        <ringGeometry args={[0.29, 0.36, 36, 1, 0, Math.PI * 1.65]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={r2}>
        <ringGeometry args={[0.19, 0.24, 20, 1, 0, Math.PI * 0.75]} />
        <meshBasicMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={r3}>
        <ringGeometry args={[0.07, 0.11, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.042, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
      </mesh>
    </group>
  );
};

// ============================================================
//  VOLUMETRIC BEAM
// ============================================================
const Beam: React.FC<{ h: number; w: number; color: string }> = ({ h, w, color }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.getElapsedTime();
    (ref.current.material as THREE.MeshBasicMaterial).opacity =
      0.08 + Math.abs(Math.sin(t * 1.5)) * 0.1;
    ref.current.scale.x = 1 + Math.sin(t * 3.2) * 0.035;
    ref.current.scale.z = 1 + Math.sin(t * 3.2) * 0.035;
  });
  return (
    <mesh ref={ref} position={[0, h / 2, 0]}>
      <cylinderGeometry args={[w * 0.1, w * 0.58, h, 12, 1, true]} />
      <meshBasicMaterial color={color} transparent opacity={0.16} side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

// ============================================================
//  DISTRICT CLUSTER
// ============================================================
interface DistrictProps {
  pos: XYZ; color: string;
  buildings: { x: number; z: number; w: number; d: number; h: number; delay?: number }[];
  hasBeam?: boolean; beamH?: number;
  hasDisk?: boolean; diskH?: number;
}
const DistrictCluster: React.FC<DistrictProps> = ({
  pos, color, buildings, hasBeam = false, beamH = 4, hasDisk = false, diskH = 2
}) => (
  <group position={[pos[0], 0, pos[2]]}>
    {buildings.map((b, i) => (
      <Building key={i}
        pos={[b.x, 0, b.z]} w={b.w} d={b.d} h={b.h}
        color={color} riseDelay={b.delay ?? i * 0.045}
      />
    ))}
    {hasBeam && <Beam h={beamH} w={0.55} color={color} />}
    {hasDisk && <HoloDisk pos={[0, 0, 0]} color={color} h={diskH} />}
    {/* Ground area glow */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
      <circleGeometry args={[1.6, 36]} />
      <meshBasicMaterial color={color} transparent opacity={0.055}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
    {/* Secondary wider ambient glow */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
      <circleGeometry args={[2.8, 36]} />
      <meshBasicMaterial color={color} transparent opacity={0.02}
        blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  </group>
);

// ============================================================
//  PYRAMID / REACTOR NODE
// ============================================================
const PyramidTower: React.FC<{ pos: XYZ; color: string; h: number; r: number }> = ({
  pos, color, h, r
}) => {
  const [rise, setRise] = useState(0.01);
  const topRing = useRef<THREE.Mesh>(null);
  useEffect(() => {
    const t0 = performance.now();
    let id: number;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / 1400, 1);
      setRise(1 - Math.pow(1 - p, 4));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  useFrame((s) => {
    if (topRing.current) {
      topRing.current.rotation.y = s.clock.getElapsedTime() * 2;
      (topRing.current.material as THREE.MeshBasicMaterial).opacity =
        0.4 + Math.abs(Math.sin(s.clock.getElapsedTime() * 5)) * 0.55;
    }
  });
  const ah = h * rise;
  const colObj = useMemo(() => new THREE.Color(color), [color]);
  return (
    <group position={[pos[0], 0, pos[2]]}>
      <mesh position={[0, ah / 2, 0]}>
        <coneGeometry args={[r, ah, 6, 1]} />
        <meshStandardMaterial color="#050c1c" roughness={0.08} metalness={0.97}
          emissive={colObj} emissiveIntensity={0.14} />
      </mesh>
      <mesh position={[0, ah / 2, 0]}>
        <coneGeometry args={[r + 0.025, ah + 0.02, 6, 1]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} side={THREE.BackSide}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {[0.33, 0.62].map((f, i) => (
        <mesh key={i} position={[0, ah * f, 0]}>
          <torusGeometry args={[r * (1 - f * 0.5), 0.032, 6, 28]} />
          <meshBasicMaterial color={color} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      {rise > 0.85 && (
        <mesh ref={topRing} position={[0, ah + 0.06, 0]}>
          <torusGeometry args={[r * 0.38, 0.028, 6, 22]} />
          <meshBasicMaterial color={color} transparent opacity={0.75}
            blending={THREE.AdditiveBlending} />
        </mesh>
      )}
      {rise > 0.9 && (
        <mesh position={[0, ah + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[r * 0.45, 28]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.8}
            blending={THREE.AdditiveBlending} />
        </mesh>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <circleGeometry args={[r * 1.7, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.065}
          blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <HoloDisk pos={[0, 0, 0]} color={color} h={ah + 0.35} />
    </group>
  );
};

// ============================================================
//  COMET DATA PACKET (sphere + fading trail + directional cone)
// ============================================================
interface CometProps {
  curve: THREE.QuadraticBezierCurve3;
  color: string;
  offset: number;
  speed: number;
  size?: number;
}
const CometPacket: React.FC<CometProps> = ({ curve, color, offset, speed, size = 0.08 }) => {
  const grp = useRef<THREE.Group>(null);
  const trailRefs = useRef<(THREE.Mesh | null)[]>([]);
  const coneRef = useRef<THREE.Mesh>(null);
  const TRAIL = 7; // trail spheres

  const prevPos = useRef(new THREE.Vector3());
  const currPos = useRef(new THREE.Vector3());

  useFrame((s) => {
    const t = ((s.clock.getElapsedTime() * speed) + offset) % 1;
    curve.getPointAt(t, currPos.current);

    if (grp.current) {
      grp.current.position.copy(currPos.current);

      // Orient cone in direction of travel
      if (coneRef.current && prevPos.current.lengthSq() > 0) {
        const dir = currPos.current.clone().sub(prevPos.current).normalize();
        if (dir.lengthSq() > 0.0001) {
          const up = new THREE.Vector3(0, 1, 0);
          const axis = up.clone().cross(dir).normalize();
          const angle = Math.acos(Math.max(-1, Math.min(1, up.dot(dir))));
          if (axis.lengthSq() > 0.001) {
            coneRef.current.setRotationFromAxisAngle(axis, angle);
          }
        }
      }
    }
    prevPos.current.copy(currPos.current);

    // Trail spheres
    for (let i = 0; i < TRAIL; i++) {
      const ref = trailRefs.current[i];
      if (!ref) continue;
      const trailT = ((t - (i + 1) * 0.018) + 1) % 1;
      const pt = curve.getPointAt(trailT);
      ref.position.copy(pt);
      const m = ref.material as THREE.MeshBasicMaterial;
      m.opacity = (1 - (i + 1) / (TRAIL + 1)) * 0.75;
      ref.scale.setScalar(1 - (i / TRAIL) * 0.75);
    }
  });

  return (
    <>
      {/* Trail spheres */}
      {Array.from({ length: TRAIL }).map((_, i) => (
        <mesh key={i} ref={el => { trailRefs.current[i] = el; }}>
          <sphereGeometry args={[size, 6, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.5}
            blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
      {/* Head group */}
      <group ref={grp}>
        {/* Bright core */}
        <mesh>
          <sphereGeometry args={[size, 10, 10]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
        {/* Color glow sphere */}
        <mesh>
          <sphereGeometry args={[size * 1.85, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.45}
            blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* Directional arrow cone */}
        <mesh ref={coneRef} position={[0, size * 2.8, 0]}>
          <coneGeometry args={[size * 0.55, size * 2.2, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.7}
            blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </>
  );
};

// ============================================================
//  GLOWING HIGHWAY with MULTIPLE comet packets
// ============================================================
interface HighwayProps {
  start: XYZ; end: XYZ; color: string; speed?: number;
  packets?: number; midY?: number;
}
const GlowingHighway: React.FC<HighwayProps> = ({
  start, end, color, speed = 0.28, packets = 3, midY
}) => {
  const curve = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const my = midY ?? (1.2 + Math.random() * 0.7);
    const mid = new THREE.Vector3((s.x + e.x) / 2, my, (s.z + e.z) / 2);
    return new THREE.QuadraticBezierCurve3(s, mid, e);
  }, []);

  const pts = curve.getPoints(80);

  return (
    <group>
      {/* Path lines: outer glow, mid, inner */}
      {[
        { off: 0, opacity: 0.12, w: 4 },
        { off: 0, opacity: 0.35, w: 1 },
      ].map((l, i) => (
        <line key={i}>
          <bufferGeometry onUpdate={g => g.setFromPoints(pts)} />
          <lineBasicMaterial color={color} transparent opacity={l.opacity} linewidth={l.w} />
        </line>
      ))}
      {/* Data packets */}
      {Array.from({ length: packets }).map((_, i) => (
        <CometPacket
          key={i}
          curve={curve}
          color={color}
          offset={i / packets}
          speed={speed * (0.85 + i * 0.2)}
          size={i === 0 ? 0.085 : 0.062}
        />
      ))}
    </group>
  );
};

// ============================================================
//  ATMOSPHERIC PARTICLES
// ============================================================
const CyberDust: React.FC = () => {
  const count = 240;
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 38;
      a[i * 3 + 1] = Math.random() * 10;
      a[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return a;
  }, []);
  const cols = useMemo(() => {
    const pal = ['#06b6d4', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#f472b6', '#ffffff'];
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const col = new THREE.Color(pal[i % pal.length]);
      c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
    }
    return c;
  }, []);
  useFrame((s) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const t = s.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i);
      y += 0.007 + Math.sin(t * 0.5 + i * 0.3) * 0.003;
      if (y > 10) y = 0;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[cols, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.7}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

// ============================================================
//  RADAR SWEEP
// ============================================================
const RadarSweep: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.z = -s.clock.getElapsedTime() * 0.3; });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[0, 23, 64, 1, 0, Math.PI / 2.6]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.032}
        side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
};

// ============================================================
//  GROUND
// ============================================================
const GroundFloor: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]} receiveShadow>
      <planeGeometry args={[42, 30]} />
      <meshStandardMaterial color="#010408" roughness={0.06} metalness={0.98} />
    </mesh>
    <gridHelper args={[42, 65, '#081520', '#040c18']} position={[0, 0.002, 0]} />
    <gridHelper args={[42, 13, '#112035', '#080f20']} position={[0, 0.004, 0]} />
  </group>
);

// ============================================================
//  FLOATING INFO CARD
// ============================================================
const InfoCard: React.FC<{
  pos: XYZ; y: number; color: string; name: string; sub: string; cover: string; show: boolean;
}> = ({ pos, y, color, name, sub, cover, show }) => (
  <Html position={[pos[0], y, pos[2]]} center distanceFactor={9} className="pointer-events-none">
    <div style={{
      background: 'rgba(2,5,16,0.93)', border: `1px solid ${color}50`,
      borderLeft: `3px solid ${color}`, borderRadius: '2px',
      padding: '6px 10px', minWidth: '162px',
      boxShadow: `0 0 24px ${color}25, inset 0 0 10px ${color}06`,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <span style={{ color: '#e2e8f0', fontWeight: 800, fontSize: 10.5, fontFamily: 'monospace', letterSpacing: 0.4 }}>{name}</span>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
      </div>
      <span style={{ color: '#475569', fontSize: 7.5, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 1.6, display: 'block' }}>{sub}</span>
      {show && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, paddingTop: 4, borderTop: `1px solid ${color}20`, fontSize: 7.8, fontFamily: 'monospace', color: '#475569' }}>
          <span>Coverage</span>
          <span style={{ color, fontWeight: 700 }}>{cover}</span>
        </div>
      )}
    </div>
  </Html>
);

// ============================================================
//  MAIN COMPONENT
// ============================================================
export const Workspace10_DigitalTwin: React.FC = () => {
  const { twinLayers, twinPreset, toggleTwinLayer } = useAxiomStore();
  const orbitRef = useRef<any>(null);

  // ─── CITY DISTRICTS ──────────────────────────────────────
  const districts = useMemo(() => [
    // CENTER — Order Management (RED, tallest, dominant)
    {
      id: 'orders', name: 'Order Management District',
      sub: '18 Services | 24 APIs | 142 Components', cover: '97.3%',
      pos: [0, 0, -0.5] as XYZ, col: '#ef4444', layer: 'services',
      hasBeam: true, hasDisk: true, diskH: 3.4, beamH: 6.5,
      buildings: [
        { x: 0, z: 0, w: 0.60, d: 0.60, h: 2.9, delay: 0 },
        { x: -0.68, z: 0.22, w: 0.36, d: 0.36, h: 2.15, delay: 0.04 },
        { x: 0.68, z: -0.22, w: 0.32, d: 0.32, h: 1.95, delay: 0.07 },
        { x: 0.32, z: 0.68, w: 0.26, d: 0.26, h: 1.55, delay: 0.10 },
        { x: -0.32, z: -0.68, w: 0.24, d: 0.24, h: 1.38, delay: 0.13 },
        { x: 0.88, z: 0.46, w: 0.20, d: 0.20, h: 1.12, delay: 0.16 },
        { x: -0.88, z: -0.46, w: 0.19, d: 0.19, h: 0.98, delay: 0.18 },
        { x: 0.52, z: -0.88, w: 0.17, d: 0.17, h: 0.82, delay: 0.20 },
        { x: -0.52, z: 0.88, w: 0.16, d: 0.16, h: 0.72, delay: 0.22 },
        { x: 1.08, z: -0.42, w: 0.15, d: 0.15, h: 0.62, delay: 0.24 },
        { x: -1.08, z: 0.42, w: 0.14, d: 0.14, h: 0.56, delay: 0.26 },
        { x: 0.72, z: 1.04, w: 0.13, d: 0.13, h: 0.46, delay: 0.28 },
        { x: -0.72, z: -1.04, w: 0.12, d: 0.12, h: 0.42, delay: 0.30 },
      ],
    },
    // TOP-LEFT — Web Experience Hub (BLUE)
    {
      id: 'web', name: 'Web Experience Hub',
      sub: '12 Pages | 156 Components', cover: '98.2%',
      pos: [-4.5, 0, -4.5] as XYZ, col: '#3B82F6', layer: 'pages',
      hasBeam: true, hasDisk: false, beamH: 4.5,
      buildings: [
        { x: 0, z: 0, w: 0.5, d: 0.5, h: 2.1, delay: 0 },
        { x: -0.58, z: 0.22, w: 0.30, d: 0.30, h: 1.5, delay: 0.05 },
        { x: 0.58, z: -0.22, w: 0.27, d: 0.27, h: 1.28, delay: 0.08 },
        { x: 0.26, z: 0.62, w: 0.21, d: 0.21, h: 1.0, delay: 0.11 },
        { x: -0.26, z: -0.62, w: 0.20, d: 0.20, h: 0.85, delay: 0.14 },
        { x: 0.78, z: 0.42, w: 0.17, d: 0.17, h: 0.68, delay: 0.16 },
        { x: -0.78, z: -0.42, w: 0.16, d: 0.16, h: 0.60, delay: 0.18 },
        { x: 0.52, z: -0.82, w: 0.14, d: 0.14, h: 0.52, delay: 0.20 },
        { x: -0.52, z: 0.82, w: 0.13, d: 0.13, h: 0.46, delay: 0.22 },
        { x: 1.0, z: -0.52, w: 0.12, d: 0.12, h: 0.40, delay: 0.24 },
      ],
    },
    // TOP-RIGHT — Customer Portal (PURPLE)
    {
      id: 'portal', name: 'Customer Portal City',
      sub: '24 Pages | 342 Components', cover: '96.1%',
      pos: [5.2, 0, -4.5] as XYZ, col: '#8B5CF6', layer: 'pages',
      hasBeam: false, hasDisk: true, diskH: 2.6,
      buildings: [
        { x: 0, z: 0, w: 0.54, d: 0.54, h: 2.3, delay: 0 },
        { x: -0.62, z: 0.22, w: 0.32, d: 0.32, h: 1.65, delay: 0.05 },
        { x: 0.62, z: -0.22, w: 0.28, d: 0.28, h: 1.42, delay: 0.08 },
        { x: 0.28, z: 0.65, w: 0.22, d: 0.22, h: 1.1, delay: 0.11 },
        { x: -0.28, z: -0.65, w: 0.21, d: 0.21, h: 0.92, delay: 0.14 },
        { x: 0.82, z: 0.44, w: 0.18, d: 0.18, h: 0.74, delay: 0.16 },
        { x: -0.82, z: -0.44, w: 0.17, d: 0.17, h: 0.65, delay: 0.18 },
        { x: 0.52, z: -0.88, w: 0.15, d: 0.15, h: 0.54, delay: 0.20 },
        { x: -0.52, z: 0.88, w: 0.14, d: 0.14, h: 0.47, delay: 0.22 },
        { x: 1.04, z: -0.52, w: 0.13, d: 0.13, h: 0.40, delay: 0.24 },
      ],
    },
    // LEFT — Payment Processing (AMBER/GOLD)
    {
      id: 'payments', name: 'Payment Processing City',
      sub: '15 Services | 18 APIs | 86 Components', cover: '95.7%',
      pos: [-8.0, 0, -0.5] as XYZ, col: '#f59e0b', layer: 'services',
      hasBeam: false, hasDisk: false,
      buildings: [
        { x: 0, z: 0, w: 0.52, d: 0.52, h: 1.8, delay: 0 },
        { x: -0.58, z: 0.20, w: 0.30, d: 0.30, h: 1.32, delay: 0.06 },
        { x: 0.58, z: -0.20, w: 0.27, d: 0.27, h: 1.14, delay: 0.09 },
        { x: 0.26, z: 0.62, w: 0.21, d: 0.21, h: 0.88, delay: 0.12 },
        { x: -0.26, z: -0.62, w: 0.20, d: 0.20, h: 0.76, delay: 0.15 },
        { x: 0.80, z: 0.40, w: 0.17, d: 0.17, h: 0.63, delay: 0.18 },
        { x: -0.80, z: -0.40, w: 0.16, d: 0.16, h: 0.56, delay: 0.20 },
        { x: 0.52, z: -0.82, w: 0.14, d: 0.14, h: 0.46, delay: 0.22 },
        { x: -0.52, z: 0.82, w: 0.13, d: 0.13, h: 0.40, delay: 0.24 },
      ],
    },
    // RIGHT — User Management (CYAN)
    {
      id: 'users', name: 'User Management Sector',
      sub: '10 Services | 14 APIs | 72 Components', cover: '93.1%',
      pos: [8.0, 0, -0.5] as XYZ, col: '#06B6D4', layer: 'services',
      hasBeam: false, hasDisk: true, diskH: 1.9,
      buildings: [
        { x: 0, z: 0, w: 0.48, d: 0.48, h: 1.65, delay: 0 },
        { x: -0.54, z: 0.18, w: 0.28, d: 0.28, h: 1.22, delay: 0.06 },
        { x: 0.54, z: -0.18, w: 0.25, d: 0.25, h: 1.05, delay: 0.09 },
        { x: 0.24, z: 0.60, w: 0.19, d: 0.19, h: 0.80, delay: 0.12 },
        { x: -0.24, z: -0.60, w: 0.18, d: 0.18, h: 0.70, delay: 0.15 },
        { x: 0.76, z: 0.38, w: 0.15, d: 0.15, h: 0.57, delay: 0.18 },
        { x: -0.76, z: -0.38, w: 0.14, d: 0.14, h: 0.50, delay: 0.20 },
      ],
    },
    // BOTTOM-LEFT — Inventory Zone (GREEN)
    {
      id: 'inventory', name: 'Inventory Management Zone',
      sub: '12 Services | 16 APIs | 78 Components', cover: '94.2%',
      pos: [-6.5, 0, 4.8] as XYZ, col: '#10B981', layer: 'services',
      hasBeam: false, hasDisk: false,
      buildings: [
        { x: 0, z: 0, w: 0.46, d: 0.46, h: 1.45, delay: 0 },
        { x: -0.52, z: 0.18, w: 0.27, d: 0.27, h: 1.06, delay: 0.06 },
        { x: 0.52, z: -0.18, w: 0.24, d: 0.24, h: 0.92, delay: 0.09 },
        { x: 0.22, z: 0.58, w: 0.18, d: 0.18, h: 0.72, delay: 0.12 },
        { x: -0.22, z: -0.58, w: 0.17, d: 0.17, h: 0.64, delay: 0.15 },
        { x: 0.74, z: 0.36, w: 0.14, d: 0.14, h: 0.52, delay: 0.18 },
        { x: -0.74, z: -0.36, w: 0.13, d: 0.13, h: 0.46, delay: 0.20 },
        { x: 0.46, z: -0.78, w: 0.12, d: 0.12, h: 0.38, delay: 0.22 },
      ],
    },
    // BOTTOM-RIGHT — Notification Hub (TEAL/GREEN)
    {
      id: 'notifications', name: 'Notification Service Hub',
      sub: '6 Services | 8 APIs | 48 Components', cover: '91.5%',
      pos: [7.0, 0, 5.0] as XYZ, col: '#14b8a6', layer: 'services',
      hasBeam: false, hasDisk: false,
      buildings: [
        { x: 0, z: 0, w: 0.42, d: 0.42, h: 1.3, delay: 0 },
        { x: -0.48, z: 0.16, w: 0.25, d: 0.25, h: 0.96, delay: 0.06 },
        { x: 0.48, z: -0.16, w: 0.22, d: 0.22, h: 0.82, delay: 0.09 },
        { x: 0.20, z: 0.54, w: 0.17, d: 0.17, h: 0.65, delay: 0.12 },
        { x: -0.20, z: -0.54, w: 0.16, d: 0.16, h: 0.58, delay: 0.15 },
        { x: 0.70, z: 0.32, w: 0.13, d: 0.13, h: 0.46, delay: 0.18 },
      ],
    },
  ], []);

  // ─── PYRAMID REACTOR NODES ────────────────────────────────
  const pyramids = useMemo(() => [
    {
      id: 'analytics', name: 'Analytics & Reporting Hub',
      sub: '8 Services | 12 APIs | 64 Components', cover: '92.8%',
      pos: [0.5, 0, 5.8] as XYZ, col: '#F59E0B', h: 1.55, r: 0.72,
    },
    {
      id: 'auth', name: 'Auth Gateway Node',
      sub: '4 Services | 6 APIs | 28 Components', cover: '99.1%',
      pos: [-4.0, 0, 2.2] as XYZ, col: '#a855f7', h: 1.1, r: 0.52,
    },
    {
      id: 'search', name: 'Search & Index Engine',
      sub: '5 Services | 7 APIs | 35 Components', cover: '90.4%',
      pos: [4.5, 0, 2.5] as XYZ, col: '#22d3ee', h: 1.05, r: 0.50,
    },
  ], []);

  // ─── ROAD GRID (multi-lane, directional) ─────────────────
  const roads = useMemo(() => {
    const A = '#f59e0b'; // amber (main arteries)
    const C = '#06b6d4'; // cyan (secondary)
    const D = '#1e4060'; // dim (tertiary)
    return [
      // ── MAIN AMBER ARTERIES ──
      // E–W backbone
      { p1: [-12, 0, -0.5] as XYZ, p2: [12, 0, -0.5] as XYZ, c: A, w: 0.38, b: true, l: 5 },
      // N–S backbone
      { p1: [0, 0, -9] as XYZ, p2: [0, 0, 8] as XYZ, c: A, w: 0.38, b: true, l: 5 },
      // ── SECONDARY CYAN ──
      // E–W at z=-2.5
      { p1: [-12, 0, -2.8] as XYZ, p2: [12, 0, -2.8] as XYZ, c: C, w: 0.22, b: false, l: 4 },
      // E–W at z=2.5
      { p1: [-12, 0, 2.5] as XYZ, p2: [12, 0, 2.5] as XYZ, c: C, w: 0.22, b: false, l: 4 },
      // E–W at z=5.2
      { p1: [-12, 0, 5.2] as XYZ, p2: [12, 0, 5.2] as XYZ, c: C, w: 0.20, b: false, l: 3 },
      // N–S at x=-4
      { p1: [-4, 0, -9] as XYZ, p2: [-4, 0, 8] as XYZ, c: C, w: 0.22, b: false, l: 4 },
      // N–S at x=4
      { p1: [4, 0, -9] as XYZ, p2: [4, 0, 8] as XYZ, c: C, w: 0.22, b: false, l: 4 },
      // N–S at x=-8
      { p1: [-8, 0, -9] as XYZ, p2: [-8, 0, 8] as XYZ, c: C, w: 0.20, b: false, l: 3 },
      // N–S at x=8
      { p1: [8, 0, -9] as XYZ, p2: [8, 0, 8] as XYZ, c: C, w: 0.20, b: false, l: 3 },
      // ── DIAGONAL DISTRICT CONNECTORS ──
      { p1: [-4.5, 0, -4.5] as XYZ, p2: [-4, 0, -0.5] as XYZ, c: '#3B82F6', w: 0.16, b: false, l: 3 },
      { p1: [5.2, 0, -4.5] as XYZ, p2: [4, 0, -0.5] as XYZ, c: '#8B5CF6', w: 0.16, b: false, l: 3 },
      { p1: [-8.0, 0, -0.5] as XYZ, p2: [-4.5, 0, -4.5] as XYZ, c: A, w: 0.15, b: false, l: 3 },
      { p1: [8.0, 0, -0.5] as XYZ, p2: [5.2, 0, -4.5] as XYZ, c: C, w: 0.15, b: false, l: 3 },
      { p1: [-4, 0, 2.2] as XYZ, p2: [-6.5, 0, 4.8] as XYZ, c: '#a855f7', w: 0.14, b: false, l: 3 },
      { p1: [4.5, 0, 2.5] as XYZ, p2: [7.0, 0, 5.0] as XYZ, c: '#22d3ee', w: 0.14, b: false, l: 3 },
      { p1: [0.5, 0, 5.8] as XYZ, p2: [-6.5, 0, 4.8] as XYZ, c: '#F59E0B', w: 0.14, b: false, l: 3 },
      { p1: [0.5, 0, 5.8] as XYZ, p2: [7.0, 0, 5.0] as XYZ, c: '#F59E0B', w: 0.14, b: false, l: 3 },
      // ── TERTIARY DIM PATHS ──
      { p1: [-4.5, 0, -4.5] as XYZ, p2: [-8, 0, -0.5] as XYZ, c: D, w: 0.12, b: false, l: 2 },
      { p1: [5.2, 0, -4.5] as XYZ, p2: [8, 0, -0.5] as XYZ, c: D, w: 0.12, b: false, l: 2 },
    ];
  }, []);

  // ─── JUNCTIONS ───────────────────────────────────────────
  const junctions = useMemo<Array<{ pos: XYZ; c: string; r: number }>>(() => [
    { pos: [0, 0, -0.5], c: '#ef4444', r: 0.70 },
    { pos: [-4.5, 0, -4.5], c: '#3B82F6', r: 0.50 },
    { pos: [5.2, 0, -4.5], c: '#8B5CF6', r: 0.50 },
    { pos: [-8.0, 0, -0.5], c: '#f59e0b', r: 0.46 },
    { pos: [8.0, 0, -0.5], c: '#06B6D4', r: 0.46 },
    { pos: [-6.5, 0, 4.8], c: '#10B981', r: 0.42 },
    { pos: [7.0, 0, 5.0], c: '#14b8a6', r: 0.42 },
    { pos: [0.5, 0, 5.8], c: '#F59E0B', r: 0.44 },
    { pos: [-4.0, 0, 2.2], c: '#a855f7', r: 0.38 },
    { pos: [4.5, 0, 2.5], c: '#22d3ee', r: 0.38 },
    // Grid intersections
    { pos: [-4, 0, -0.5], c: '#06b6d4', r: 0.28 },
    { pos: [4, 0, -0.5], c: '#06b6d4', r: 0.28 },
    { pos: [0, 0, -2.8], c: '#3B82F6', r: 0.24 },
    { pos: [0, 0, 2.5], c: '#F59E0B', r: 0.24 },
    { pos: [-8, 0, -2.8], c: '#f59e0b', r: 0.22 },
    { pos: [8, 0, -2.8], c: '#06B6D4', r: 0.22 },
    { pos: [-4, 0, -2.8], c: '#3B82F6', r: 0.22 },
    { pos: [4, 0, -2.8], c: '#8B5CF6', r: 0.22 },
    { pos: [-4, 0, 2.5], c: '#a855f7', r: 0.22 },
    { pos: [4, 0, 2.5], c: '#22d3ee', r: 0.22 },
    { pos: [-8, 0, 2.5], c: '#10B981', r: 0.20 },
    { pos: [8, 0, 2.5], c: '#14b8a6', r: 0.20 },
    { pos: [-8, 0, 5.2], c: '#10B981', r: 0.18 },
    { pos: [8, 0, 5.2], c: '#14b8a6', r: 0.18 },
    { pos: [0, 0, 5.2], c: '#F59E0B', r: 0.20 },
    { pos: [-4, 0, 5.2], c: '#a855f7', r: 0.18 },
    { pos: [4, 0, 5.2], c: '#22d3ee', r: 0.18 },
  ], []);

  // ─── WARNING MARKERS ─────────────────────────────────────
  const warnings = useMemo<Array<{ pos: XYZ; c: string }>>(() => [
    { pos: [-3.2, 0, 1.4], c: '#ef4444' },
    { pos: [3.4, 0, 1.8], c: '#f97316' },
    { pos: [-5.8, 0, -1.6], c: '#ef4444' },
    { pos: [6.2, 0, -1.8], c: '#f97316' },
    { pos: [0.5, 0, 3.8], c: '#ef4444' },
    { pos: [-1.8, 0, -2.2], c: '#f97316' },
    { pos: [2.2, 0, -2.5], c: '#ef4444' },
  ], []);

  // ─── DATA HIGHWAYS (arching with comet trails) ───────────
  // Color matches source district; direction = source → dest
  const highways = useMemo(() => [
    // Payments → Orders
    { s: [-8.0, 0.05, -0.5] as XYZ, e: [0, 0.05, -0.5] as XYZ, c: '#f59e0b', spd: 0.24, n: 3, my: 1.5 },
    // Web → Orders
    { s: [-4.5, 0.05, -4.5] as XYZ, e: [0, 0.05, -0.5] as XYZ, c: '#3B82F6', spd: 0.28, n: 3, my: 1.6 },
    // Orders → Portal
    { s: [0, 0.05, -0.5] as XYZ, e: [5.2, 0.05, -4.5] as XYZ, c: '#ef4444', spd: 0.22, n: 3, my: 1.4 },
    // Orders → Users
    { s: [0, 0.05, -0.5] as XYZ, e: [8.0, 0.05, -0.5] as XYZ, c: '#ef4444', spd: 0.20, n: 3, my: 1.2 },
    // Orders → Analytics
    { s: [0, 0.05, -0.5] as XYZ, e: [0.5, 0.05, 5.8] as XYZ, c: '#ef4444', spd: 0.30, n: 3, my: 1.8 },
    // Orders → Inventory
    { s: [0, 0.05, -0.5] as XYZ, e: [-6.5, 0.05, 4.8] as XYZ, c: '#ef4444', spd: 0.26, n: 2, my: 1.7 },
    // Orders → Notifications
    { s: [0, 0.05, -0.5] as XYZ, e: [7.0, 0.05, 5.0] as XYZ, c: '#10B981', spd: 0.27, n: 2, my: 1.6 },
    // Portal → Users
    { s: [5.2, 0.05, -4.5] as XYZ, e: [8.0, 0.05, -0.5] as XYZ, c: '#8B5CF6', spd: 0.28, n: 2, my: 1.3 },
    // Web → Portal
    { s: [-4.5, 0.05, -4.5] as XYZ, e: [5.2, 0.05, -4.5] as XYZ, c: '#3B82F6', spd: 0.18, n: 2, my: 1.8 },
    // Users → Notifications
    { s: [8.0, 0.05, -0.5] as XYZ, e: [7.0, 0.05, 5.0] as XYZ, c: '#06B6D4', spd: 0.24, n: 2, my: 1.2 },
    // Payments → Inventory
    { s: [-8.0, 0.05, -0.5] as XYZ, e: [-6.5, 0.05, 4.8] as XYZ, c: '#f59e0b', spd: 0.22, n: 2, my: 1.2 },
    // Auth → Orders
    { s: [-4.0, 0.05, 2.2] as XYZ, e: [0, 0.05, -0.5] as XYZ, c: '#a855f7', spd: 0.32, n: 2, my: 1.1 },
    // Search → Orders
    { s: [4.5, 0.05, 2.5] as XYZ, e: [0, 0.05, -0.5] as XYZ, c: '#22d3ee', spd: 0.30, n: 2, my: 1.1 },
    // Auth → Inventory
    { s: [-4.0, 0.05, 2.2] as XYZ, e: [-6.5, 0.05, 4.8] as XYZ, c: '#a855f7', spd: 0.20, n: 2, my: 1.0 },
    // Search → Notifications
    { s: [4.5, 0.05, 2.5] as XYZ, e: [7.0, 0.05, 5.0] as XYZ, c: '#22d3ee', spd: 0.22, n: 2, my: 1.0 },
    // Analytics → Orders
    { s: [0.5, 0.05, 5.8] as XYZ, e: [0, 0.05, -0.5] as XYZ, c: '#F59E0B', spd: 0.18, n: 2, my: 2.0 },
  ], []);

  const handleZoom = (zIn: boolean) => {
    if (!orbitRef.current) return;
    orbitRef.current.object.position.multiplyScalar(zIn ? 0.82 : 1.22);
    orbitRef.current.update();
  };

  const activeTests = [
    { name: 'Payment Flow Test', pct: 95, time: '2m 30s' },
    { name: 'Order Processing Test', pct: 88, time: '1m 45s' },
    { name: 'User Authentication Test', pct: 92, time: '2m 15s' },
    { name: 'Inventory Update Test', pct: 85, time: '1m 30s' },
    { name: 'Notification Delivery Test', pct: 90, time: '2m 45s' },
  ];
  const events = [
    { t: '10:24:30', e: 'Traffic spike in Payment Service' },
    { t: '10:24:28', e: 'Order Service instance started' },
    { t: '10:24:25', e: 'Test suite completed: User Auth API' },
    { t: '10:24:23', e: 'Risk score updated: User Auth API' },
    { t: '10:24:20', e: 'DB perf degraded: Analytics DB' },
  ];

  return (
    <div className="flex-1 bg-[#01020a] p-4 overflow-y-auto flex flex-col font-sans h-full min-h-0 select-none relative">
      {/* CRT scanlines */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)' }} />

      <div className="space-y-3 flex-1 flex flex-col min-h-0 z-20">

        {/* ── HEADER BAR ── */}
        <div className="flex justify-between items-center border-b border-cyan-500/20 pb-3 shrink-0">
          <div className="flex items-center gap-3 bg-[#050e1e]/85 p-2.5 rounded border border-cyan-500/20
              shadow-[0_0_14px_rgba(6,182,212,0.07)]">
            <div className="h-11 w-11 rounded-full border-2 border-cyan-400/70 relative flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin opacity-75" />
              <span className="text-[10px] font-black text-cyan-400 font-mono">98.7%</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 text-[9px] font-mono">
              {[['PERF','96.2%'],['RELI','99.1%'],['SEC','97.8%'],['COV','94.3%']].map(([l,v]) => (
                <span key={l} className="text-slate-500">{l} <span className="text-cyan-400 font-bold">{v}</span></span>
              ))}
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-[13px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2 justify-center">
              <Radio size={13} className="animate-pulse" /> AXIOM DIGITAL TWIN
            </h2>
            <span className="text-[8.5px] text-slate-500 font-mono uppercase tracking-widest">
              Live Architecture Map // Preset: <strong className="text-cyan-400">{twinPreset.toUpperCase()}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 bg-[#050e1e]/85 p-2.5 rounded border border-cyan-500/20
              shadow-[0_0_14px_rgba(6,182,212,0.07)] text-[9px] font-mono">
            <div className="space-y-0.5 pr-3 border-r border-white/8">
              <div className="text-cyan-400">RPS: <span className="text-white font-bold">12,847</span></div>
              <div className="text-purple-400">DATA: <span className="font-bold">2.4 GB/s</span></div>
              <div className="text-cyan-400">CONN: <span className="text-white font-bold">1,429</span></div>
            </div>
            <div className="w-18 h-8 flex items-end gap-0.5 border-b border-cyan-500/20 px-1">
              {[60, 40, 72, 95, 52, 80, 65].map((h, i) => (
                <div key={i} className="flex-1 rounded-t"
                  style={{ height: `${h}%`, background: 'rgba(6,182,212,0.5)', border: '1px solid rgba(6,182,212,0.25)' }} />
              ))}
            </div>
          </div>
        </div>

        {/* ── 3D CANVAS ── */}
        <div className="flex-1 bg-[#01020a] border border-cyan-500/20 rounded-lg relative overflow-hidden
            min-h-[440px] shadow-[inset_0_0_50px_rgba(6,182,212,0.03)]">

          {/* HUD corners */}
          {[['top-1 left-1','border-t-2 border-l-2'],['top-1 right-1','border-t-2 border-r-2'],
            ['bottom-14 left-1','border-b-2 border-l-2'],['bottom-14 right-1','border-b-2 border-r-2']].map(([p,b],i) => (
            <div key={i} className={`absolute ${p} w-4 h-4 ${b} border-cyan-500/28 pointer-events-none z-20`} />
          ))}
          <div className="absolute top-2 left-2 text-[7px] text-cyan-500/22 font-mono pointer-events-none z-20">SYS.HOLO_MAP_v5.2 // MULTI_LANE_ROADS // COMET_TRAILS</div>
          <div className="absolute top-2 right-2 text-[7px] text-cyan-500/22 font-mono pointer-events-none z-20">RADAR: ACTIVE // 32ms // DISTRICTS: {districts.length}</div>

          <Canvas
            camera={{ position: [0, 14, 20], fov: 37 }}
            shadows dpr={[1, 2]}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
          >
            <color attach="background" args={['#010208']} />
            <fogExp2 attach="fog" args={['#010208', 0.034]} />

            <OrbitControls ref={orbitRef} enableDamping dampingFactor={0.065}
              minDistance={4} maxDistance={34}
              maxPolarAngle={Math.PI / 2 - 0.035} />

            {/* ── LIGHTING ── */}
            <ambientLight intensity={0.28} />
            <spotLight position={[14, 26, 16]} angle={0.28} penumbra={1} intensity={1.7} castShadow />
            <directionalLight position={[-12, 14, -12]} intensity={0.3} color="#0a1830" />
            {/* Per-district colored point lights */}
            <pointLight position={[0, 5, -0.5]} color="#ef4444" intensity={5.0} distance={14} />
            <pointLight position={[-4.5, 3, -4.5]} color="#3B82F6" intensity={3.8} distance={11} />
            <pointLight position={[5.2, 3, -4.5]} color="#8B5CF6" intensity={3.8} distance={11} />
            <pointLight position={[-8.0, 3, -0.5]} color="#f59e0b" intensity={3.8} distance={11} />
            <pointLight position={[8.0, 3, -0.5]} color="#06B6D4" intensity={3.8} distance={11} />
            <pointLight position={[-6.5, 3, 4.8]} color="#10B981" intensity={3.2} distance={10} />
            <pointLight position={[7.0, 3, 5.0]} color="#14b8a6" intensity={3.2} distance={10} />
            <pointLight position={[0.5, 3, 5.8]} color="#F59E0B" intensity={3.2} distance={10} />
            <pointLight position={[-4.0, 2.5, 2.2]} color="#a855f7" intensity={2.8} distance={8} />
            <pointLight position={[4.5, 2.5, 2.5]} color="#22d3ee" intensity={2.8} distance={8} />

            {/* ── SCENE ── */}
            <RadarSweep />
            <CyberDust />
            <GroundFloor />

            {/* Road network — multi-lane */}
            {roads.map((r, i) => (
              <MultiLaneRoad key={i}
                p1={r.p1} p2={r.p2} color={r.c} width={r.w} bright={r.b} lanes={r.l} />
            ))}

            {/* Junction roundabouts */}
            {junctions.map((j, i) => (
              <RoadJunction key={i} pos={j.pos} color={j.c} r={j.r} />
            ))}

            {/* Warning triangles */}
            {twinLayers.risks && warnings.map((w, i) => (
              <WarningMarker key={i} pos={w.pos} color={w.c} />
            ))}

            {/* District city clusters */}
            {districts.map((d) => {
              const show = (d.layer === 'pages' && twinLayers.pages) ||
                (d.layer === 'services' && twinLayers.services) || true;
              if (!show) return null;
              const tallest = Math.max(...d.buildings.map(b => b.h));
              return (
                <group key={d.id}>
                  <DistrictCluster
                    pos={d.pos} color={d.col} buildings={d.buildings}
                    hasBeam={(d as any).hasBeam} beamH={(d as any).beamH ?? tallest + 3}
                    hasDisk={(d as any).hasDisk} diskH={(d as any).diskH ?? tallest + 0.5}
                  />
                  <InfoCard
                    pos={d.pos} y={tallest + 0.55}
                    color={d.col} name={d.name} sub={d.sub} cover={d.cover}
                    show={twinLayers.coverage}
                  />
                </group>
              );
            })}

            {/* Pyramid reactor nodes */}
            {twinLayers.databases && pyramids.map((p) => (
              <group key={p.id}>
                <PyramidTower pos={p.pos} color={p.col} h={p.h} r={p.r} />
                <InfoCard pos={p.pos} y={p.h + 0.5} color={p.col}
                  name={p.name} sub={p.sub} cover={p.cover} show={twinLayers.coverage} />
              </group>
            ))}

            {/* Data highways with comet trails & directional cones */}
            {twinLayers.apis && highways.map((h, i) => (
              <GlowingHighway key={i}
                start={h.s} end={h.e} color={h.c}
                speed={h.spd} packets={h.n} midY={h.my} />
            ))}
          </Canvas>

          {/* ── CONTROLS ── */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#030c1c]/94 backdrop-blur
            border border-cyan-500/28 px-4 py-2 rounded flex items-center gap-2.5
            shadow-[0_0_20px_rgba(6,182,212,0.1)] z-30 pointer-events-auto">
            <button onClick={() => handleZoom(true)} className="text-cyan-400 hover:text-white p-1.5 hover:bg-cyan-500/10 rounded transition-colors"><ZoomIn size={14} /></button>
            <button onClick={() => handleZoom(false)} className="text-cyan-400 hover:text-white p-1.5 hover:bg-cyan-500/10 rounded transition-colors"><ZoomOut size={14} /></button>
            <button onClick={() => orbitRef.current?.reset()} className="text-cyan-400 hover:text-white p-1.5 hover:bg-cyan-500/10 rounded transition-colors"><RotateCcw size={14} /></button>
            <div className="h-4 w-px bg-cyan-500/20" />
            {[
              { k: 'pages', l: 'Pages', v: 'blue' },
              { k: 'services', l: 'Services', v: 'green' },
              { k: 'apis', l: 'Highways', v: 'cyan' },
              { k: 'databases', l: 'DB Nodes', v: 'yellow' },
              { k: 'risks', l: 'Warnings', v: 'red' },
              { k: 'coverage', l: 'Coverage', v: 'purple' },
            ].map(({ k, l, v }) => {
              const on = twinLayers[k as keyof typeof twinLayers];
              const cls: Record<string, string> = {
                blue: on ? 'bg-blue-500/18 text-blue-400 border-blue-500/38' : 'text-slate-600 border-transparent',
                green: on ? 'bg-green-500/18 text-green-400 border-green-500/38' : 'text-slate-600 border-transparent',
                cyan: on ? 'bg-cyan-500/18 text-cyan-400 border-cyan-500/38' : 'text-slate-600 border-transparent',
                yellow: on ? 'bg-yellow-500/18 text-yellow-400 border-yellow-500/38' : 'text-slate-600 border-transparent',
                red: on ? 'bg-red-500/18 text-red-400 border-red-500/38' : 'text-slate-600 border-transparent',
                purple: on ? 'bg-purple-500/18 text-purple-400 border-purple-500/38' : 'text-slate-600 border-transparent',
              };
              return (
                <button key={k} onClick={() => toggleTwinLayer(k as any)}
                  className={`px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase rounded-sm border transition-all ${cls[v]}`}>
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── BOTTOM DIAGNOSTICS ── */}
        <div className="grid grid-cols-12 gap-3 shrink-0">
          <div className="col-span-3 bg-[#040b1a]/85 border border-cyan-500/18 rounded-lg p-3 flex flex-col min-h-0">
            <span className="text-[8.5px] font-bold text-cyan-400 uppercase tracking-widest font-mono block mb-2 pb-1.5 border-b border-cyan-500/10 flex items-center gap-1.5">
              <Layers size={10} /> Dependency Graph
            </span>
            <div className="flex-1 relative min-h-[72px] flex items-center justify-center">
              <div className="absolute h-8 w-8 rounded-full border border-cyan-500/30 animate-pulse" />
              {[['22%','20%','#3B82F6'],['78%','20%','#8B5CF6'],['78%','80%','#EF4444'],['22%','80%','#10B981'],['50%','15%','#f59e0b']].map(([x,y,c],i) => (
                <div key={i} className="absolute h-2 w-2 rounded-full" style={{ left:x, top:y, background:c, transform:'translate(-50%,-50%)', boxShadow:`0 0 5px ${c}` }} />
              ))}
              <svg className="absolute inset-0 h-full w-full opacity-28 pointer-events-none">
                {[['22%','20%'],['78%','20%'],['78%','80%'],['22%','80%'],['50%','15%']].map(([x,y],i) => (
                  <line key={i} x1="50%" y1="50%" x2={x} y2={y} stroke="#06b6d4" strokeWidth="1" />
                ))}
              </svg>
            </div>
          </div>

          <div className="col-span-5 bg-[#040b1a]/85 border border-cyan-500/18 rounded-lg p-3 flex flex-col min-h-0">
            <span className="text-[8.5px] font-bold text-cyan-400 uppercase tracking-widest font-mono block mb-2 pb-1.5 border-b border-cyan-500/10 flex items-center gap-1.5">
              <Activity size={10} /> Active Test Runners
            </span>
            <div className="flex-1 space-y-1.5 overflow-hidden">
              {activeTests.map(t => (
                <div key={t.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2 truncate">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                    <span className="text-slate-200 font-mono text-[9.5px] truncate">{t.name}</span>
                  </div>
                  <div className="flex gap-2 text-[8.5px] font-mono shrink-0 ml-1">
                    <span className="text-cyan-400 font-bold">{t.pct}%</span>
                    <span className="text-slate-500">{t.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4 bg-[#040b1a]/85 border border-cyan-500/18 rounded-lg p-3 flex flex-col min-h-0">
            <span className="text-[8.5px] font-bold text-cyan-400 uppercase tracking-widest font-mono block mb-2 pb-1.5 border-b border-cyan-500/10 flex items-center gap-1.5">
              <Cpu size={10} /> System Events
            </span>
            <div className="flex-1 space-y-1.5 overflow-hidden font-mono text-[8.5px]">
              {events.map((ev, i) => (
                <div key={i} className="flex gap-2 border-b border-white/4 pb-1.5">
                  <span className="text-cyan-500/40 shrink-0">{ev.t}</span>
                  <span className="text-slate-300 truncate">{ev.e}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
