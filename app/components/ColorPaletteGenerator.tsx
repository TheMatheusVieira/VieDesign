import { useState } from "react";
import { Copy, RefreshCw, Check } from "lucide-react";
import { Button } from "./ui/button";

interface Color {
  hex: string;
  name: string;
}

export function ColorPaletteGenerator() {
  const [palette, setPalette] = useState<Color[]>(generateHarmonicPalette());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // --- FUNÇÕES DE GERAÇÃO DE CORES ---

  /**
   * Gera uma paleta harmônica com 5 cores baseada em um matiz aleatório.
   * Este é o estado inicial e o que o botão "Gerar Nova Paleta" faz.
   */
  function generateHarmonicPalette(): Color[] {
    const colors: Color[] = [];
    // eslint-disable-next-line react-hooks/purity
    const baseHue = Math.floor(Math.random() * 360);

    // Gerar 5 cores harmônicas (esquema pentagrama)
    const hues = [
      baseHue,
      (baseHue + 72) % 360,
      (baseHue + 144) % 360,
      (baseHue + 216) % 360,
      (baseHue + 288) % 360,
    ];

    for (let i = 0; i < 5; i++) {
      // eslint-disable-next-line react-hooks/purity
      const saturation = 60 + Math.random() * 30;
      // eslint-disable-next-line react-hooks/purity
      const lightness = 50 + Math.random() * 20;
      
      const hex = hslToHex(hues[i], saturation, lightness);
      colors.push({
        hex,
        name: getColorName(hues[i]),
      });
    }

    return colors;
  }

  function generateShadesPalette(baseHex: string): Color[] {
    const { h, s, l: baseLightness } = hexToHsl(baseHex);

    const lightnessSteps = [
      Math.min(95, baseLightness + 30), // 1. Mais claro
      Math.min(90, baseLightness + 15), // 2. Claro
      baseLightness,                    // 3. Base
      Math.max(15, baseLightness - 15), // 4. Escuro
      Math.max(5, baseLightness - 30),  // 5. Mais escuro
    ];

    return lightnessSteps.map(l => {
      const hex = hslToHex(h, s, l);
      return {
        hex,
        name: getColorName(h)
      };
    });
  }


  function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }


  function hexToHsl(hex: string): { h: number; s: number; l: number } {
    hex = hex.substring(1);

    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; 
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }


  function getColorName(hue: number): string {
    if (hue < 30) return "Vermelho";
    if (hue < 60) return "Laranja";
    if (hue < 90) return "Amarelo";
    if (hue < 150) return "Verde";
    if (hue < 210) return "Ciano";
    if (hue < 270) return "Azul";
    if (hue < 330) return "Roxo";
    return "Vermelho";
  }

  const handleColorClick = (clickedColor: Color, index: number) => {
    navigator.clipboard.writeText(clickedColor.hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);


    const shadesPalette = generateShadesPalette(clickedColor.hex);
    setPalette(shadesPalette);
  };


  const handleGenerateNew = () => {
    setPalette(generateHarmonicPalette());
    setCopiedIndex(null);
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Clique em uma cor para copiar e gerar tons
          </p>
        </div>
        <Button onClick={handleGenerateNew} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Gerar Nova Paleta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {palette.map((color, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleColorClick(color, index)}
          >
            <div
              className="h-48 w-full"
              style={{ backgroundColor: color.hex }}
            />
            <div className="p-4 bg-background border border-t-0 rounded-b-lg">
              <p className="text-sm text-muted-foreground">{color.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="uppercase">{color.hex}</p>
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="mb-3">Paleta Completa (CSS Variables)</h3>
        <div className="relative">
          <code className="block p-4 bg-muted rounded text-sm overflow-x-auto">
            :root {"{"}
            {palette.map((color, index) => (
              <div key={index}>
                {"  "}--color-{index + 1}: {color.hex};
              </div>
            ))}
            {"}"}
          </code>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => {
              const cssVars = `:root {\n${palette
                .map((c, i) => `  --color-${i + 1}: ${c.hex};`)
                .join("\n")}\n}`;
              navigator.clipboard.writeText(cssVars);
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}