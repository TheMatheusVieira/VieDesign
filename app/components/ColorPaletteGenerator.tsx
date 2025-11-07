import { useState } from "react";
import { Button } from "./ui/button";
import { Copy, RefreshCw, Check } from "lucide-react";

interface Color {
  hex: string;
  name: string;
}

export function ColorPaletteGenerator() {
  const [palette, setPalette] = useState<Color[]>(generatePalette());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function generatePalette(): Color[] {
    const colors: Color[] = [];
    // eslint-disable-next-line react-hooks/purity
    const baseHue = Math.floor(Math.random() * 360);

    // Gerar 5 cores harmônicas
    for (let i = 0; i < 5; i++) {
      const hue = (baseHue + i * 72) % 360; // Analogous colors
      // eslint-disable-next-line react-hooks/purity
      const saturation = 60 + Math.random() * 30;
      // eslint-disable-next-line react-hooks/purity
      const lightness = 45 + Math.random() * 20;
      
      const hex = hslToHex(hue, saturation, lightness);
      colors.push({
        hex,
        name: getColorName(hue),
      });
    }

    return colors;
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

  const handleCopy = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerate = () => {
    setPalette(generatePalette());
    setCopiedIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            Clique em uma cor para copiar o código hexadecimal
          </p>
        </div>
        <Button onClick={handleGenerate} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Gerar Nova Paleta
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {palette.map((color, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleCopy(color.hex, index)}
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
