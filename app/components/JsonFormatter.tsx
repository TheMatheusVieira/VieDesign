import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Copy, Check, FileJson } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setError("");
    } catch (err) {
      setError("JSON inválido. Verifique a sintaxe.");
      setFormattedJson("");
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setFormattedJson(minified);
      setError("");
    } catch (err) {
      setError("JSON inválido. Verifique a sintaxe.");
      setFormattedJson("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setJsonInput("");
    setFormattedJson("");
    setError("");
  };

  const countStats = () => {
    if (!formattedJson) return null;
    
    try {
      const parsed = JSON.parse(formattedJson);
      const keys = JSON.stringify(parsed).match(/"[^"]+"\s*:/g)?.length || 0;
      return {
        characters: formattedJson.length,
        lines: formattedJson.split("\n").length,
        keys,
      };
    } catch {
      return null;
    }
  };

  const stats = countStats();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Cole seu JSON aqui</Label>
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"name": "Example", "data": [1, 2, 3]}'
          className="font-mono min-h-[200px]"
        />
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleFormat}>Formatar</Button>
          <Button onClick={handleMinify} variant="outline">
            Minificar
          </Button>
          <Button onClick={handleClear} variant="outline">
            Limpar
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {formattedJson && (
        <>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>JSON Formatado</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
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
              value={formattedJson}
              readOnly
              className="font-mono min-h-[300px]"
            />
          </div>

          {stats && (
            <div className="flex gap-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileJson className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="text-muted-foreground">Linhas:</span>{" "}
                  {stats.lines}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Caracteres:</span>{" "}
                {stats.characters}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Chaves:</span>{" "}
                {stats.keys}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
