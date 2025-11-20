"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { getProduct, updateProduct, getCategory } from "../actions";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditModalProps {
  id: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditModal({ id, onClose, onSuccess }: EditModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category_id: "",
    image: null as File | null,
    preview: "", // untuk preview gambar
  });
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (id != null) {
      (async () => {
        try {
          const catRes = await getCategory({});
          setCategories(catRes.data.rows);

          const res = await getProduct({ id });
          const product = res.data.rows[0];
          const imageUrl = product.image
            ? `${process.env.NEXT_PUBLIC_API_UPLOAD}/images/${product.image}`
            : "";
          setFormData({
            name: product.name,
            price: product.price.toString(),
            category_id: product.category_id.toString(),
            image: product.image,
            preview: imageUrl, // misalnya image_url dari API
          });
        } catch (error) {
          console.error("Gagal ambil data produk:", error);
          toastr.error("Gagal memuat data produk");
        }
      })();
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price || !formData.category_id) {
      toastr.error("Semua field wajib diisi");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        image: formData.image instanceof File ? formData.image : null,
      };

      await updateProduct(payload, id!);
      toastr.success("Berhasil update produk");

      setFormData({
        name: "",
        price: "",
        category_id: "",
        image: null,
        preview: "",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      toastr.error("Gagal menyimpan produk");
    }
  }

  const cancel = () => {
    setFormData({
      name: "",
      price: "",
      category_id: "",
      image: null,
      preview: "",
    });
    onClose();
  };

  return (
    <Dialog open={id != null} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[825px]">
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          cancel={cancel}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}

function ProductForm({
  formData,
  setFormData,
  handleSubmit,
  cancel,
  categories,
}: {
  formData: {
    name: string;
    price: string;
    category_id: string;
    image: File | null;
    preview: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      price: string;
      category_id: string;
      image: File | null;
      preview: string;
    }>
  >;
  handleSubmit: (e: React.FormEvent) => void;
  cancel: () => void;
  categories: any[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Edit Produk</DialogTitle>
        <DialogDescription>
          Ubah data produk dan klik simpan untuk memperbarui.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 mt-4">
        {/* Nama Produk */}
        <div className="grid gap-3">
          <Label htmlFor="name">
            Nama Produk <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Nama produk"
          />
        </div>

        {/* Harga */}
        <div className="grid gap-3">
          <Label htmlFor="price">
            Harga <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="Harga"
          />
        </div>

        {/* Kategori */}
        <div className="grid gap-3">
          <Label>
            Kategori <span className="text-red-500">*</span>
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {formData.category_id
                  ? categories.find(
                    (item) => item.id.toString() === formData.category_id
                  )?.name ?? "Pilih kategori..."
                  : "Pilih kategori..."}
                <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Cari kategori..." className="h-9" />
                <CommandList>
                  <CommandEmpty>Kategori tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.id.toString()}
                        onSelect={() => {
                          setFormData({
                            ...formData,
                            category_id: item.id.toString(),
                          });
                          setOpen(false);
                        }}
                      >
                        {item.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            formData.category_id === item.id.toString()
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Gambar */}
        <div className="grid gap-3">
          <Label htmlFor="image">Gambar</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              if (file) {
                const previewUrl = URL.createObjectURL(file);
                setFormData({ ...formData, image: file, preview: previewUrl });
              } else {
                setFormData({ ...formData, image: null, preview: "" });
              }
            }}
          />
          {formData.preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Preview Gambar:</p>
              <img
                src={formData.preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-red-500 text-white" onClick={cancel}>
              Batal
            </Button>
          </DialogClose>
          <Button type="submit" className="bg-green-500 text-white">
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
}
