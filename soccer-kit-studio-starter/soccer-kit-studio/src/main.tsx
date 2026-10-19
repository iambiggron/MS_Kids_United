import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import './style.css';

type Part = 'jersey' | 'shorts' | 'socks';
type Images = Record<Part, string | null>;
const initial: Images = { jersey: null, shorts: null, socks: null };
function Shirt({ color, texture }: { color: string; texture: THREE.Texture | null }) {
  return <group position={[0, 1.35, 0]}>
    <mesh><cylinderGeometry args={[0.62, 0.51, 1.12, 12, 1]}/><meshStandardMaterial color={color} roughness={0.86}/></mesh>
    <mesh position={[-0.72, 0.37, 0]} rotation={[0, 0, -0.45]}><cylinderGeometry args={[0.23, 0.29, 0.55, 12]}/><meshStandardMaterial color={color} roughness={0.86}/></mesh>
    <mesh position={[0.72, 0.37, 0]} rotation={[0, 0, 0.45]}><cylinderGeometry args={[0.23, 0.29, 0.55, 12]}/><meshStandardMaterial color={color} roughness={0.86}/></mesh>
    <mesh position={[0, 0.02, 0.53]}><planeGeometry args={[0.88, 0.9]}/><meshStandardMaterial map={texture} color={texture ? '#ffffff' : color} transparent={!!texture} side={THREE.DoubleSide}/></mesh>
    <mesh position={[0, 0.56, 0]}><torusGeometry args={[0.23, 0.065, 8, 32]}/><meshStandardMaterial color="#f4f4f4"/></mesh>
  </group>;
}
function GarmentTexture({ url }: { url: string | null }) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!url) { setTex(null); return; }
    const loader = new THREE.TextureLoader();
    loader.load(url, t => { t.colorSpace = THREE.SRGBColorSpace; setTex(t); });
    return () => setTex(null);
  }, [url]);
  return tex;
}
function Kit({ images, colors }: { images: Images; colors: Record<Part, string> }) {
  const jersey = GarmentTexture({ url: images.jersey });
  const shorts = GarmentTexture({ url: images.shorts });
  const socks = GarmentTexture({ url: images.socks });
  const shortsMat = useMemo(() => new THREE.MeshStandardMaterial({color: colors.shorts, roughness: 0.9}), [colors.shorts]);
  return <group position={[0, 0.25, 0]}>
    <Shirt color={colors.jersey} texture={jersey}/>
    <group position={[0, 0.3, 0]}>
      <mesh position={[0, 0.28, 0]} material={shortsMat}><boxGeometry args={[1.03, 0.34, 0.68]}/></mesh>
      {[-0.28, 0.28].map(x => <mesh key={x} position={[x, -0.1, 0]} material={shortsMat}><cylinderGeometry args={[0.28, 0.32, 0.48, 12]}/></mesh>)}
      <mesh position={[0, 0.18, 0.355]}><planeGeometry args={[0.85, 0.32]}/><meshStandardMaterial color={shorts ? '#ffffff' : colors.shorts} map={shorts} transparent={!!shorts}/></mesh>
    </group>
    {[-0.3, 0.3].map(x => <group key={x} position={[x, -0.85, 0]}>
      <mesh><cylinderGeometry args={[0.16, 0.19, 1.35, 16]}/><meshStandardMaterial color={colors.socks} roughness={0.9}/></mesh>
      <mesh position={[0, 0, 0.185]}><planeGeometry args={[0.23, 0.9]}/><meshStandardMaterial color={socks ? '#ffffff' : colors.socks} map={socks} transparent={!!socks}/></mesh>
      <mesh position={[0, -0.67, 0.16]}><boxGeometry args={[0.37, 0.18, 0.65]}/><meshStandardMaterial color={colors.socks}/></mesh>
    </group>)}
  </group>;
}
function App() {
  const [images, setImages] = useState<Images>(initial);
  const [colors, setColors] = useState<Record<Part, string>>({ jersey: '#1565c0', shorts: '#142f62', socks: '#1565c0' });
  const [angle, setAngle] = useState(0);
  const upload = (part: Part, file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image.'); return; }
    const reader = new FileReader();
    reader.onload = () => setImages(prev => ({ ...prev, [part]: String(reader.result) }));
    reader.readAsDataURL(file);
  };
  return <div className="app">
    <header><strong>SOCCER KIT <span>STUDIO</span></strong><small>3D Apparel Visualizer · Prototype v0.1</small></header>
    <aside><h2>Customize your kit</h2><p>Upload a graphic for each garment. This prototype places artwork on the front-facing surfaces; full UV wraps come next.</p>
      {(['jersey','shorts','socks'] as Part[]).map(part => <section key={part}><h3>{part[0].toUpperCase()+part.slice(1)}</h3><label>Base color <input aria-label={`${part} color`} type="color" value={colors[part]} onChange={e => setColors(p => ({...p,[part]:e.target.value}))}/></label><label className="upload">Upload artwork <input aria-label={`${part} artwork`} type="file" accept="image/*" onChange={e => upload(part,e.target.files?.[0])}/></label>{images[part] && <button onClick={() => setImages(p => ({...p,[part]:null}))}>Remove artwork</button>}</section>)}
      <button className="reset" onClick={() => {setImages(initial);setColors({jersey:'#1565c0',shorts:'#142f62',socks:'#1565c0'});setAngle(0);}}>Reset kit</button>
    </aside>
    <main><div className="viewer"><Canvas camera={{position:[0,1.6,6],fov:40}} gl={{preserveDrawingBuffer:true}}><color attach="background" args={['#e9edf2']}/><ambientLight intensity={1.3}/><directionalLight position={[3,6,5]} intensity={2.2}/><group rotation={[0,angle,0]}><Kit images={images} colors={colors}/></group><ContactShadows position={[0,-1.55,0]} opacity={0.28} scale={6} blur={2.8}/><OrbitControls enablePan={false} minDistance={3} maxDistance={10} target={[0,0.3,0]}/></Canvas></div><nav><button onClick={() => setAngle(0)}>Front</button><button onClick={() => setAngle(Math.PI)}>Back</button><button onClick={() => setAngle(Math.PI/2)}>Side</button></nav><p className="hint">Drag to rotate · Scroll to zoom · Camera presets rotate the kit</p></main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
