"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Edit2, Plus, X } from "lucide-react";

interface Item {
  id: string;
  name: string;
  price: number;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "Soft Cotton T-Shirt", price: 25 },
    { id: "2", name: "Gentle Breeze Mug", price: 15 },
    { id: "3", name: "Pastel Notebook", price: 12 },
  ]);

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEditClick = (item: Item) => {
    setIsEditing(item.id);
    setFormData({ name: item.name, price: item.price.toString() });
    setIsAdding(false);
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(null);
    setFormData({ name: "", price: "" });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    setFormData({ name: "", price: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (isAdding) {
      setItems([
        ...items,
        { id: Date.now().toString(), name: formData.name, price: Number(formData.price) },
      ]);
      setIsAdding(false);
    } else if (isEditing) {
      setItems(
        items.map((item) =>
          item.id === isEditing
            ? { ...item, name: formData.name, price: Number(formData.price) }
            : item
        )
      );
      setIsEditing(null);
    }
    setFormData({ name: "", price: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Items Management</h1>
          <p className="text-muted-foreground">Create, Read, Update, and Delete your items here.</p>
        </div>
        {!isAdding && !isEditing && (
          <Button onClick={handleAddClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        )}
      </div>

      {(isAdding || isEditing) && (
        <Card className="glass border-primary/20 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>{isAdding ? "Add New Item" : "Edit Item"}</CardTitle>
            <CardDescription>Fill out the form below to save the item.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Soft Blanket"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 29.99"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-primary">Save Item</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
              </div>
            </CardContent>
          </form>
        </Card>
      )}

      <Card className="glass border-white/20 shadow-sm">
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-muted/50">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                      No items found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle text-muted-foreground">{item.id.slice(-4)}</td>
                      <td className="p-4 align-middle font-medium">{item.name}</td>
                      <td className="p-4 align-middle">${item.price.toFixed(2)}</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}>
                            <Edit2 className="h-4 w-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
