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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { updatePermission, getPermission } from "../actions";

interface EditModalProps {
  id: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditModal({ id, onClose, onSuccess }: EditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    if (id !== null) {
      (async () => {
        try {
          const permission = await getPermission({ id: id });
          setFormData({
            name: permission.data.rows[0].name,
            description: permission.data.rows[0].description
          });
        } catch (error) {
          console.error("Gagal ambil data kategori:", error);
          toastr.error("Gagal memuat data kategori");
        }
      })();
    } else {
      setFormData({
        name: "",
        description: ""
      });
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name.trim()) {
      toastr.error("Nama permission wajib diisi");
      return;
    }

    if (!formData.description.trim()) {
      toastr.error("Deskripsi wajib diisi");
      return;
    }

    try {
      await updatePermission(formData, id!);
      toastr.success("Berhasil update permission");

      setFormData({
        name: "",
        description: ""
      });
      onSuccess();
      onClose()
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      toastr.error("Gagal menyimpan kategori");
    }
  }

  const cancel = () => {
    setFormData({
      name: "",
      description: ""
    });
    onClose();
  };

  return (
    <div>
      <Dialog open={id !== null} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[825px]">
          <PermissionForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            cancel={cancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PermissionForm({
  formData,
  setFormData,
  handleSubmit,
  cancel,
}: {
  formData: {
    name: string,
    description: string
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string,
    description: string
  }>>;
  handleSubmit: (e: React.FormEvent) => void;
  cancel: () => void;
}) {
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Edit Access</DialogTitle>
        <DialogDescription>Ubah data access dan klik simpan untuk memperbarui.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 mt-4">
        <div className="grid gap-3">
          <Label htmlFor="name">
            Nama Access <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Nama"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="description">
            Deskripsi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Deskripsi"
          />
        </div>
      </div>

      <div className="mt-4">
        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-red-500 text-white" onClick={cancel}>
              Batal
            </Button>
          </DialogClose>
          <Button type="submit" className="bg-green-400 text-white">
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </div>
    </form>
  );
}
