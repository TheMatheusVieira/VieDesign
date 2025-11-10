import { useState } from "react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Copy, Check, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface ColorStop {
  id: string;
  color: string;
  position: number;
}

export function GradientGenerator() {
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState([90]);
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: "1", color: "#667eea", position: 0 },
    { id: "2", color: "#764ba2", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const addColorStop = () => {
    const newStop: ColorStop = {
      id: Date.now().toString(),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
      position: 50,
    };
    setColorStops([...colorStops, newStop].sort((a, b) => a.position - b.position));
  };

  const removeColorStop = (id: string) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((stop) => stop.id !== id));
    }
  };

  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setColorStops(
      colorStops
        .map((stop) => (stop.id === id ? { ...stop, ...updates } : stop))
        .sort((a, b) => a.position - b.position)
    );
  };

  const generateGradientCSS = () => {
    const stops = colorStops
      .sort((a, b) => a.position - b.position)
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      return `linear-gradient(${angle[0]}deg, ${stops})`;
    } else {
      return `radial-gradient(circle, ${stops})`;
    }
  };

  const gradientCSS = generateGradientCSS();
  const cssCode = `background: ${gradientCSS};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Tipo de Gradiente</Label>
          <Select
            value={gradientType}
            onValueChange={(value) => setGradientType(value as "linear" | "radial")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="radial">Radial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {gradientType === "linear" && (
          <div className="space-y-3">
            <Label>Ângulo: {angle[0]}°</Label>
            <Slider
              value={angle}
              onValueChange={setAngle}
              min={0}
              max={360}
              step={1}
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Paradas de Cor</Label>
            <Button variant="outline" size="sm" onClick={addColorStop}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-3">
            {colorStops.map((stop) => (
              <Card key={stop.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) =>
                        updateColorStop(stop.id, { color: e.target.value })
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <span className="text-sm flex-1">{stop.color}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColorStop(stop.id)}
                      disabled={colorStops.length <= 2}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Posição: {stop.position}%</Label>
                    <Slider
                      value={[stop.position]}
                      onValueChange={(value) =>
                        updateColorStop(stop.id, { position: value[0] })
                      }
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Código CSS</Label>
          <div className="flex gap-2">
            <code className="flex-1 p-3 bg-muted rounded text-sm break-all">
              {cssCode}
            </code>
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
        <div
          className="w-full h-80 rounded-lg"
          style={{ background: gradientCSS }}
        />
      </div>
    </div>
  );
}
