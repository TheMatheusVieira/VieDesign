/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import {
  Palette,
  Box,
  Code2,
  FileJson,
  BookMarked,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Slider } from "./components/ui/slider";
import { Label } from "./components/ui/label";
import { ColorPaletteGenerator } from "./components/ColorPaletteGenerator";
import { SvgToJsxConverter } from "./components/SvgToJsxConverter";
import { JsonFormatter } from "./components/JsonFormatter";
import { SnippetManager } from "./components/SnippetManager";


function BoxShadowGenerator() {
  const [offsetX, setOffsetX] = useState([0]);
  const [offsetY, setOffsetY] = useState([10]);
  const [blur, setBlur] = useState([20]);
  const [spread, setSpread] = useState([0]);
  const [color, setColor] = useState("#000000");
  const [opacity, setOpacity] = useState([0.3]);
  const [copied, setCopied] = useState(false);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const boxShadow = `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${hexToRgba(
    color,
    opacity[0]
  )}`;

  const cssCode = `box-shadow: ${boxShadow};`;

  const handleCopy = () => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = cssCode;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Offset X: {offsetX}px</Label>
          <Slider
            value={offsetX}
            onValueChange={setOffsetX}
            min={-100}
            max={100}
            step={1}
          />
        </div>
        <div className="space-y-3">
          <Label>Offset Y: {offsetY}px</Label>
          <Slider
            value={offsetY}
            onValueChange={setOffsetY}
            min={-100}
            max={100}
            step={1}
          />
        </div>
        <div className="space-y-3">
          <Label>Blur: {blur}px</Label>
          <Slider
            value={blur}
            onValueChange={setBlur}
            min={0}
            max={100}
            step={1}
          />
        </div>
        <div className="space-y-3">
          <Label>Spread: {spread}px</Label>
          <Slider
            value={spread}
            onValueChange={setSpread}
            min={-50}
            max={50}
            step={1}
          />
        </div>
        <div className="space-y-3">
          <Label>Cor</Label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 rounded cursor-pointer border-none p-0"
              style={{ appearance: 'none' }}
            />
            <span className="text-sm text-muted-foreground">{color}</span>
          </div>
        </div>
        <div className="space-y-3">
          <Label>Opacidade: {opacity[0].toFixed(2)}</Label>
          <Slider
            value={opacity}
            onValueChange={setOpacity}
            min={0}
            max={1}
            step={0.01}
          />
        </div>
        <div className="space-y-3">
          <Label>Código CSS</Label>
          <div className="flex gap-2">
            <code className="flex-1 p-3 bg-muted rounded text-sm break-all overflow-x-auto">
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
      <div className="flex items-center justify-center p-8 bg-muted rounded-lg min-h-[300px]">
        <div
          className="w-48 h-48 bg-white rounded-lg transition-all duration-200"
          style={{ boxShadow }}
        />
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center">
       <img
          width={320}
          alt="logotipo"
          src="/logoVDsemfundo1.png"
          style={{ display: "block", marginLeft: 20}}
        />
      <div className="container mx-15 p-4 sm:p-6 max-w-7xl">
       
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ferramentas de desenvolvimento</h1>
          <p className="text-lg text-muted-foreground">
            Um conjunto de micro-ferramentas úteis para o dia a dia de desenvolvimento
          </p>
        </div>

        <Tabs defaultValue="box-shadow" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8">
            <TabsTrigger value="box-shadow" className="gap-2">
              <Box className="h-4 w-4" />
              <span className="hidden sm:inline">Box Shadow</span>
              <span className="sm:hidden">Shadow</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Cores</span>
              <span className="sm:hidden">Colors</span>
            </TabsTrigger>
            <TabsTrigger value="svg" className="gap-2">
              <Code2 className="h-4 w-4" />
              <span className="hidden sm:inline">SVG → JSX</span>
              <span className="sm:hidden">SVG</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="gap-2">
              <FileJson className="h-4 w-4" />
              <span className="hidden sm:inline">JSON</span>
            </TabsTrigger>
            <TabsTrigger value="snippets" className="gap-2">
              <BookMarked className="h-4 w-4" />
              <span className="hidden sm:inline">Snippets</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="box-shadow">
            <Card>
              <CardHeader>
                <CardTitle>Gerador de Box Shadow</CardTitle>
                <CardDescription>
                  Crie sombras perfeitas visualmente e copie o código CSS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BoxShadowGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Gerador de Paleta de Cores</CardTitle>
                <CardDescription>
                  Gere paletas de cores harmônicas para seus projetos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ColorPaletteGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="svg">
            <Card>
              <CardHeader>
                <CardTitle>Conversor SVG para JSX</CardTitle>
                <CardDescription>
                  Converta SVG para JSX compatível com React
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SvgToJsxConverter />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json">
            <Card>
              <CardHeader>
                <CardTitle>Formatador de JSON</CardTitle>
                <CardDescription>
                  Formate e valide JSON rapidamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JsonFormatter />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="snippets">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciador de Snippets</CardTitle>
                <CardDescription>
                  Salve e organize seus trechos de código reutilizáveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SnippetManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}