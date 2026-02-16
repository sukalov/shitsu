import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useGenerateUploadUrl,
  type Product,
  type Category,
} from "@/lib/hooks";
import { Id } from "../../../convex/_generated/dataModel";
import { Trash, Pencil, Plus, X, Upload } from "@phosphor-icons/react";
import { cn, getImageUrl } from "@/lib/utils";
import { AdminTableSkeleton } from "@/components/loading-states";

interface ProductFormData {
  name: string;
  price: number;
  category: Category;
  subcategory: string;
  images: string[];
  description: string;
  isSold: boolean;
  seriesId: string;
}

const emptyForm: ProductFormData = {
  name: "",
  price: 0,
  category: "merch",
  subcategory: "",
  images: [],
  description: "",
  isSold: false,
  seriesId: "",
};

export function AdminProducts() {
  const products = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const generateUploadUrl = useGenerateUploadUrl();

  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const doUpload = async () => {
      setIsUploading(true);
      try {
        for (const file of Array.from(files)) {
          const uploadUrl = await generateUploadUrl({});

          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });

          const { storageId } = await result.json();

          const newImages = [...formData.images, storageId];
          setFormData({ ...formData, images: newImages });
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Ошибка загрузки изображения");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    void doUpload();
  };

  const handleAddImageUrl = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] });
      setImageUrl("");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory || "",
      images: product.images,
      description: product.description,
      isSold: product.isSold,
      seriesId: product.seriesId || "",
    });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setIsEditing(true);
  };

  const handleDelete = (id: Id<"products">) => {
    if (confirm("Вы уверены, что хотите удалить этот товар?")) {
      void deleteProduct({ id });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const doSubmit = async () => {
      const data = {
        name: formData.name,
        price: formData.price,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        images: formData.images,
        description: formData.description,
        isSold: formData.isSold,
        seriesId: formData.seriesId || undefined,
      };

      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...data });
      } else {
        await createProduct(data);
      }

      setIsEditing(false);
      setEditingProduct(null);
      setFormData(emptyForm);
    };

    void doSubmit();
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  if (isEditing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl uppercase tracking-[0.15em]">
            {editingProduct ? "Редактирование товара" : "Новый товар"}
          </h1>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Отмена
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Цена (₽)</Label>
            <Input
              id="price"
              type="text"
              inputMode="numeric"
              value={formData.price || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, "");
                setFormData({ ...formData, price: value ? Number(value) : 0 });
              }}
              placeholder="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value as Category })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="originals">Оригиналы</SelectItem>
                <SelectItem value="merch">Мерч</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Подкатегория</Label>
            <Input
              id="subcategory"
              value={formData.subcategory}
              onChange={(e) =>
                setFormData({ ...formData, subcategory: e.target.value })
              }
              placeholder="Принты, Одежда, Аксессуары"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seriesId">Серия (ID)</Label>
            <Input
              id="seriesId"
              value={formData.seriesId}
              onChange={(e) =>
                setFormData({ ...formData, seriesId: e.target.value })
              }
              placeholder="cosmic-series"
            />
          </div>

          <div className="space-y-2">
            <Label>Изображения</Label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Загрузка..." : "Загрузить"}
              </Button>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Или URL"
              />
              <Button
                type="button"
                onClick={handleAddImageUrl}
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={getImageUrl(img)}
                    alt={`Image ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="isSold"
              onClick={() =>
                setFormData({ ...formData, isSold: !formData.isSold })
              }
              className={cn(
                "w-5 h-5 border transition-colors flex items-center justify-center",
                formData.isSold
                  ? "bg-neutral-900 border-neutral-900"
                  : "border-neutral-300 hover:border-neutral-900",
              )}
            >
              {formData.isSold && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <Label htmlFor="isSold" className="cursor-pointer">
              Продано
            </Label>
          </div>

          <Button type="submit" className="w-full">
            {editingProduct ? "Сохранить" : "Создать"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl uppercase tracking-[0.15em]">Товары</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить товар
        </Button>
      </div>

      {!products ? (
        <AdminTableSkeleton rows={5} cols={5} />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">Товаров пока нет</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-neutral-500">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-neutral-500">
                  Категория
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-neutral-500">
                  Цена
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-neutral-500">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs uppercase tracking-wider text-neutral-500">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      {product.images[0] && (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="w-12 h-12 object-cover"
                        />
                      )}
                      <span className="text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {product.category === "originals" ? "Оригиналы" : "Мерч"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {product.price.toLocaleString("ru-RU")} ₽
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs",
                        product.isSold
                          ? "bg-neutral-100 text-neutral-500"
                          : "bg-green-100 text-green-700",
                      )}
                    >
                      {product.isSold ? "Продан" : "В наличии"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(product._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
