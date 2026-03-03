# Design: MoonPhaseVisual Redesign — Clip Masking

**Date:** 2026-03-03
**File:** `src/components/MoonPhaseVisual.jsx`
**Status:** Approved

---

## Problem

`getLitPath(t)` construye el path SVG de la región iluminada usando un "arco base + elipse terminadora". Tiene dos fallos:

1. **Flip estructural en t=180°:** el arco base cambia de `sweep=1` (lado derecho) a `sweep=0` (lado izquierdo). En ese punto con `rx=r=46`, ambos arcos trazan el mismo lado → el path encierra una semiluna en vez de la luna llena.

2. **Ventanas demasiado angostas:** `t <= 1` (luna nueva) y `t >= 179 && t <= 181` (luna llena) representan ±1°. A ×MAX (1825 d/s, 60fps), el ángulo puede saltar ~54° por frame, saltándose la ventana por completo → glitch visual.

---

## Solution: `<mask>` with Three Simple Shapes

Reemplazar la construcción de paths con un elemento `<mask>` SVG que combina:

1. **Círculo negro** — base, todo oscuro
2. **Rectángulo blanco** — semiplano iluminado (derecho para creciente, izquierdo para menguante)
3. **Elipse terminadora** — blanca (suma área) o negra (resta área)

### New helper function

```javascript
function getPhaseInfo(t) {
  const T  = ((t % 360) + 360) % 360;
  const rx = Math.abs(Math.cos((T * Math.PI) / 180)) * 46;
  const baseX          = T <= 180 ? 50 : 0;
  const terminatorFill = (T > 90 && T < 270) ? 'white' : 'black';
  return { rx, baseX, terminatorFill };
}
```

### Correctness table (verified analytically)

| Phase | t | rx | baseX | termFill | Mask result |
|---|---|---|---|---|---|
| Luna nueva | 0° | 46 | 50 (right) | black | Right - full ellipse = nothing ✓ |
| Creciente | 45° | 32 | 50 (right) | black | Right - right-ellipse = right crescent ✓ |
| Cuarto crec | 90° | 0 | 50 (right) | black | Right - zero-ellipse = right half ✓ |
| Gibosa crec | 135° | 32 | 50 (right) | white | Right + left-ellipse = gibbous ✓ |
| Luna llena | 180° | 46 | 50 (right) | white | Right + full-ellipse = entire circle ✓ |
| Gibosa men | 225° | 32 | 0 (left) | white | Left + right-ellipse = gibbous ✓ |
| Cuarto men | 270° | 0 | 0 (left) | white | Left + zero-ellipse = left half ✓ |
| Menguante | 315° | 32 | 0 (left) | black | Left - left-ellipse = left crescent ✓ |

### Why no discontinuities

- **At t=90° and t=270°:** `terminatorFill` flips (black↔white) but `rx=0` → ellipse has no area → visually invisible transition ✓
- **At t=180°:** `baseX` flips (50→0) but `rx=46` and `terminatorFill='white'` → mask is entirely white in both cases ✓

---

## Changes Summary

| Item | Action |
|---|---|
| `getLitPath(t)` (30 lines) | **Delete** |
| New `getPhaseInfo(t)` (5 lines) | **Add** |
| `<path d={litPath}>` elements | **Replace** with `<circle mask="url(#phaseMask)">` |
| `<mask id="phaseMask">` in `<defs>` | **Add** (3 shapes: circle + rect + ellipse) |
| `{litPath && ...}` conditionals | **Replace** with `illum < 3` threshold for earthshine |
| Gradients: `litSphere`, `nightSide`, `limbDark` | Keep unchanged |
| Filter `moonTex` | Keep (fix: remove duplicate application on lines 137-139) |
| Maria and craters group | Keep, apply same `mask="url(#phaseMask)"` |
| Phase label + illumination % | Keep unchanged |

---

## Out of Scope

- Adding days-to-next-phase info (would require passing `days` prop)
- Framer Motion transition on phase shape
- Canvas-based rendering
