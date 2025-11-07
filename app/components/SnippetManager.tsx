import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Plus, Copy, Check, Trash2, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  category: string;
  tags: string[];
  createdAt: string;
}

const CATEGORIES = [
  "React Hooks",
  "Utility Functions",
  "Components",
  "CSS",
  "TypeScript",
  "Outros",
];

export function SnippetManager() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("devtools-snippets");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSnippets(JSON.parse(saved));
    }
  }, []);

  const saveSnippets = (newSnippets: Snippet[]) => {
    setSnippets(newSnippets);
    localStorage.setItem("devtools-snippets", JSON.stringify(newSnippets));
  };

  const handleAddSnippet = () => {
    if (!title || !code) return;

    const newSnippet: Snippet = {
      id: Date.now().toString(),
      title,
      description,
      code,
      category,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    saveSnippets([newSnippet, ...snippets]);

    // Reset form
    setTitle("");
    setDescription("");
    setCode("");
    setCategory(CATEGORIES[0]);
    setTags("");
    setIsDialogOpen(false);
  };

  const handleDeleteSnippet = (id: string) => {
    saveSnippets(snippets.filter((s) => s.id !== id));
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      filterCategory === "all" || snippet.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Snippet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Snippet</DialogTitle>
              <DialogDescription>
                Salve seu código reutilizável para acesso rápido
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: useDebounce Hook"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição (opcional)</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição do snippet"
                />
              </div>

              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags (separadas por vírgula)</Label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, hooks, debounce"
                />
              </div>

              <div className="space-y-2">
                <Label>Código</Label>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Cole seu código aqui..."
                  className="font-mono min-h-[200px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddSnippet}>Salvar Snippet</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {filteredSnippets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {snippets.length === 0
              ? "Nenhum snippet salvo ainda. Adicione seu primeiro!"
              : "Nenhum snippet encontrado com esses filtros."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredSnippets.map((snippet) => (
            <Card key={snippet.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle>{snippet.title}</CardTitle>
                    {snippet.description && (
                      <CardDescription className="mt-1">
                        {snippet.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(snippet.code, snippet.id)}
                    >
                      {copiedId === snippet.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSnippet(snippet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-2">
                  <Badge variant="secondary">{snippet.category}</Badge>
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <pre className="p-3 bg-muted rounded text-sm overflow-x-auto">
                  <code>{snippet.code}</code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
