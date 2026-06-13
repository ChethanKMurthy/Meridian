"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "motion/react";

// Real WebGL: a rotating 3D "creator graph" — nodes on a sphere connected to
// nearest neighbours, in the brand palette. Drag to rotate; auto-orbits and
// parallaxes to the pointer otherwise.
export function Graph3D() {
  const mount = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // WebGL unavailable — CSS gradient fallback stays visible
    }

    const sizeOf = () => {
      const r = el.getBoundingClientRect();
      return { w: Math.max(1, Math.round(r.width)), h: Math.max(1, Math.round(r.height || 480)) };
    };
    let { w, h } = sizeOf();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "pan-y";
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 11;

    // Brand palette: blue, violet, pink, yellow.
    const PAL = [
      new THREE.Color(0x2f6bff),
      new THREE.Color(0x8b6cff),
      new THREE.Color(0xff4f8b),
      new THREE.Color(0xffc736),
    ];

    const N = 130;
    const R = 4.2;
    const nodes: THREE.Vector3[] = [];
    const positions: number[] = [];
    const colors: number[] = [];
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      const rad = R * (0.82 + Math.random() * 0.2);
      const v = new THREE.Vector3(Math.cos(theta) * r * rad, y * rad, Math.sin(theta) * r * rad);
      nodes.push(v);
      positions.push(v.x, v.y, v.z);
      const c = PAL[i % PAL.length];
      colors.push(c.r, c.g, c.b);
    }

    // Round point sprite.
    const cv = document.createElement("canvas");
    cv.width = cv.height = 64;
    const ctx = cv.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.5, "rgba(255,255,255,0.95)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    const sprite = new THREE.CanvasTexture(cv);
    sprite.needsUpdate = true;

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.34,
      sizeAttenuation: true,
      vertexColors: true,
      map: sprite,
      transparent: true,
      depthWrite: false,
      alphaTest: 0.1,
    });
    const points = new THREE.Points(pGeo, pMat);

    // Edges to nearest neighbours.
    const linePos: number[] = [];
    const lineCol: number[] = [];
    for (let i = 0; i < N; i++) {
      const d: [number, number][] = [];
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        d.push([nodes[i].distanceToSquared(nodes[j]), j]);
      }
      d.sort((a, b) => a[0] - b[0]);
      for (let k = 0; k < 2; k++) {
        const j = d[k][1];
        if (j > i) {
          const c = PAL[i % PAL.length];
          linePos.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
          lineCol.push(c.r, c.g, c.b, c.r, c.g, c.b);
        }
      }
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePos, 3));
    lGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineCol, 3));
    const lMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.2 });
    const lines = new THREE.LineSegments(lGeo, lMat);

    const group = new THREE.Group();
    group.add(lines);
    group.add(points);
    group.rotation.x = 0.25;
    scene.add(group);

    // Interaction.
    let spin = 0;
    const autoSpin = reduce ? 0 : 0.0018;
    let parX = 0;
    let parY = 0;
    let dragRotX = 0;
    let dragRotY = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: PointerEvent) => {
      if (dragging) {
        dragRotY += (e.clientX - lastX) * 0.006;
        dragRotX += (e.clientY - lastY) * 0.006;
        lastX = e.clientX;
        lastY = e.clientY;
      } else if (!reduce) {
        const r = el.getBoundingClientRect();
        parX = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
        parY = ((e.clientY - r.top) / r.height - 0.5) * 0.4;
      }
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      try { renderer.domElement.setPointerCapture(e.pointerId); } catch {}
    };
    const onUp = () => { dragging = false; };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);

    const ro = new ResizeObserver(() => {
      const s = sizeOf();
      w = s.w;
      h = s.h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(el);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      spin += autoSpin;
      group.rotation.y += (spin + dragRotY + parX - group.rotation.y) * 0.08;
      group.rotation.x += (0.25 + dragRotX + parY - group.rotation.x) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
      pGeo.dispose();
      pMat.dispose();
      lGeo.dispose();
      lMat.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [reduce]);

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-edge bg-white shadow-[var(--shadow-card)]">
      <div className="grad-mesh absolute inset-0 opacity-60" />
      <div ref={mount} className="relative h-[420px] w-full cursor-grab active:cursor-grabbing md:h-[540px]" />
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-edge bg-white/80 px-3 py-1 text-[11.5px] font-medium text-muted backdrop-blur">
        Drag to explore the graph
      </div>
    </div>
  );
}
