"use client";

import { Copy, Check } from "lucide-react";
import React, { useState } from "react"; 
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";


export function BoxShadowGenerator() {
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
    // Use document.execCommand('copy') for compatibility in restricted environments like iframes
    try {
      const textarea = document.createElement('textarea');
      textarea.value = cssCode;
      textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // You could show an error message to the user here
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