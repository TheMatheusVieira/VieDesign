import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Copy, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function SvgToJsxConverter() {
  const [svgInput, setSvgInput] = useState("");
  const [copied, setCopied] = useState(false);

  const convertToJsx = (svg: string): string => {
    if (!svg.trim()) return "";

    const jsx = svg
      // Substituir atributos HTML por JSX
      .replace(/class=/g, "className=")
      .replace(/for=/g, "htmlFor=")
      .replace(/stroke-width=/g, "strokeWidth=")
      .replace(/stroke-linecap=/g, "strokeLinecap=")
      .replace(/stroke-linejoin=/g, "strokeLinejoin=")
      .replace(/fill-rule=/g, "fillRule=")
      .replace(/clip-rule=/g, "clipRule=")
      .replace(/fill-opacity=/g, "fillOpacity=")
      .replace(/stroke-opacity=/g, "strokeOpacity=")
      .replace(/stop-color=/g, "stopColor=")
      .replace(/stop-opacity=/g, "stopOpacity=")
      .replace(/stroke-dasharray=/g, "strokeDasharray=")
      .replace(/stroke-dashoffset=/g, "strokeDashoffset=")
      .replace(/xmlns:xlink=/g, "xmlnsXlink=")
      .replace(/xlink:href=/g, "xlinkHref=")
      // Fechar tags auto-fechadas
      .replace(/<(\w+)([^>]*)>/g, (match, tag, attrs) => {
        if (
          match.endsWith("/>") ||
          [
            "path",
            "circle",
            "rect",
            "line",
            "polyline",
            "polygon",
            "ellipse",
            "stop",
            "use",
          ].includes(tag.toLowerCase())
        ) {
          return match;
        }
        return match;
      });

    return jsx;
  };

  const convertToReactComponent = (svg: string): string => {
    if (!svg.trim()) return "";

    const jsx = convertToJsx(svg);
    return `export function IconComponent() {
  return (
    ${jsx}
  );
}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsxOutput = convertToJsx(svgInput);
  const componentOutput = convertToReactComponent(svgInput);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Cole seu SVG aqui</Label>
        <Textarea
          value={svgInput}
          onChange={(e) => setSvgInput(e.target.value)}
          placeholder='<svg width="24" height="24" viewBox="0 0 24 24">...</svg>'
          className="font-mono min-h-[200px]"
        />
      </div>

      {svgInput && (
        <Tabs defaultValue="jsx" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jsx">JSX</TabsTrigger>
            <TabsTrigger value="component">Componente React</TabsTrigger>
          </TabsList>

          <TabsContent value="jsx" className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>JSX Convertido</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(jsxOutput)}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={jsxOutput}
              readOnly
              className="font-mono min-h-[200px]"
            />
          </TabsContent>

          <TabsContent value="component" className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Componente React</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(componentOutput)}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <Textarea
              value={componentOutput}
              readOnly
              className="font-mono min-h-[200px]"
            />
          </TabsContent>
        </Tabs>
      )}

      {svgInput && (
        <div className="space-y-3">
          <Label>Preview</Label>
          <div
            className="p-8 bg-muted rounded-lg flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgInput }}
          />
        </div>
      )}
    </div>
  );
}
