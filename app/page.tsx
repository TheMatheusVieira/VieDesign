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
  Blend,
} from "lucide-react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Slider } from "./components/ui/slider";
import { Label } from "./components/ui/label";

import { ColorPaletteGenerator } from "./components/ColorPaletteGenerator";
import { SvgToJsxConverter } from "./components/SvgToJsxConverter";
import { JsonFormatter } from "./components/JsonFormatter";
import { SnippetManager } from "./components/SnippetManager";
import { GradientGenerator } from "./components/GradientGenerator";

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

  const handleCopy = async () => {
    if (copied) return;

    try {
      await navigator.clipboard.writeText(cssCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
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
              style={{ appearance: "none" }}
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

export default function App() {
  const [activeTab, setActiveTab] = useState("box-shadow");

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-[320px] flex items-center justify-center p-5">
        <img
          width={320}
          alt="logotipo Vie Design"
          src="/logoVDsemfundo1.png"
        />
      </aside>
      <main className="container mx-auto max-w-8xl flex-1 flex flex-col p-4 sm:p-10">
        {activeTab === "box-shadow" && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Ferramentas de desenvolvimento
            </h1>
            <p className="text-lg text-muted-foreground">
              Um conjunto de micro-ferramentas úteis para o dia a dia de
              desenvolvimento
            </p>
          </div>
        )}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col flex-1"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8">
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
            <TabsTrigger value="gradient" className="gap-2">
              <Blend className="h-4 w-4" />
              <span className="hidden sm:inline">Gradientes</span>
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
          
          <TabsContent value="box-shadow" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Gerador de Box Shadow</CardTitle>
                <CardDescription>
                  Crie sombras perfeitas e copie o código CSS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BoxShadowGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Gerador de Paleta de Cores</CardTitle>
                <CardDescription>
                  Gere paletas de cores harmônicas para os seus projetos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ColorPaletteGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gradient" className="flex-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Gerador de Gradientes</CardTitle>
                <CardDescription>
                  Crie gradientes personalizados e copie o código CSS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradientGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="svg" className="flex-1">
            <Card className="h-full">
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

          <TabsContent value="json" className="flex-1">
            <Card className="h-full">
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

          <TabsContent value="snippets" className="flex-1">
            <Card className="h-full">
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
      </main>
    </div>
  );
}