import { Id } from "../../../convex/_generated/dataModel";
import { AdminTableSkeleton } from "@/components/loading-states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateMerchSubcategory, useDeleteMerchSubcategory, useMerchSubcategories, useUpdateMerchSubcategoryOrder } from "@/lib/hooks";
import { DotsSixVertical } from "@phosphor-icons/react";
import { useState } from "react";

export function AdminMerchSubcategories() {
  const merchSubcategories = useMerchSubcategories();
  const createMerchSubcategory = useCreateMerchSubcategory();
  const deleteMerchSubcategory = useDeleteMerchSubcategory();
  const updateMerchSubcategoryOrder = useUpdateMerchSubcategoryOrder();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedId, setDraggedId] = useState<Id<"merchSubcategories"> | null>(
    null,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const doSubmit = async () => {
      setIsSubmitting(true);
      try {
        const finalSlug =
          slug.trim() ||
          name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");

        await createMerchSubcategory({ name: name.trim(), slug: finalSlug });
        setName("");
        setSlug("");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Не удалось создать подкатегорию",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    void doSubmit();
  };

  const handleDelete = (id: Id<"merchSubcategories">) => {
    if (
      !confirm(
        "Вы уверены, что хотите удалить эту подкатегорию? У товаров будет очищена привязка к ней.",
      )
    ) {
      return;
    }

    void deleteMerchSubcategory({ id });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl uppercase tracking-[0.15em]">
          Активные подкатегории мерча
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-10 grid grid-cols-1 md:grid-cols-[2fr,2fr,auto] gap-4 items-end max-w-3xl"
      >
        <div className="space-y-2">
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (для URL, опционально)</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <p className="text-xs text-neutral-500">
            Используется в параметре запроса: /merch?subcategory=slug
          </p>
        </div>
        <div className="flex md:block">
          <Button
            type="submit"
            className="w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Создание..." : "Добавить"}
          </Button>
        </div>
      </form>

      {error && (
        <p className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {!merchSubcategories ? (
        <AdminTableSkeleton rows={4} cols={3} />
      ) : merchSubcategories.length === 0 ? (
        <div className="text-center py-12 bg-white shadow">
          <p className="text-neutral-500">Подкатегорий пока нет</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="pl-12 py-3 text-left text-xs uppercase tracking-wider text-neutral-500">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-neutral-500">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-neutral-500">
                  Slug
                </th>
                <th className="px-6 py-3 text-right text-xs uppercase tracking-wider text-neutral-500">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {merchSubcategories.map((subcategory, index) => (
                <tr
                  key={subcategory._id}
                  className="hover:bg-neutral-50 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={() => setDraggedId(subcategory._id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (!draggedId || draggedId === subcategory._id) return;
                    const ids = merchSubcategories.map((s) => s._id);
                    const from = ids.indexOf(draggedId);
                    const to = ids.indexOf(subcategory._id);
                    if (from === -1 || to === -1) return;
                    ids.splice(from, 1);
                    ids.splice(to, 0, draggedId);
                    void updateMerchSubcategoryOrder({ orderedIds: ids });
                    setDraggedId(null);
                  }}
                  onDragEnd={() => setDraggedId(null)}
                >
                  <td className="pl-4 px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                    <div className="flex items-center gap-3">
                      <DotsSixVertical
                        className="h-4 w-4 mr-2  text-neutral-400"
                        weight="bold"
                      />
                      <span>{index + 1}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {subcategory.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {subcategory.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-500"
                      onClick={() => handleDelete(subcategory._id)}
                    >
                      Удалить
                    </Button>
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

