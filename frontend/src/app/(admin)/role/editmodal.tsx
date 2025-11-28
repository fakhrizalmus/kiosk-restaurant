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
import { updateRole, getRole } from "../actions";

interface EditModalProps {
  id: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditModal({ id, onClose, onSuccess }: EditModalProps) {
  const [formData, setFormData] = useState({
    role: "",
    permission: ""
  });

  useEffect(() => {
    if (id !== null) {
      (async () => {
        try {
          const role = await getRole({ id: id });
          setFormData({
            role: permission.data.rows[0].role,
            permission: permission.data.rows[0].permission
          });
        } catch (error) {
          console.error("Gagal ambil data kategori:", error);
          toastr.error("Gagal memuat data kategori");
        }
      })();
    } else {
      setFormData({
        role: "",
        permission: ""
      });
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.role.trim()) {
      toastr.error("Nama role wajib diisi");
      return;
    }

    try {
      await updateRole(formData, id!);
      toastr.success("Berhasil update role");

      setFormData({
        role: "",
        permission: ""
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
      role: "",
      permission: ""
    });
    onClose();
  };

  return (
    <div>
      <Dialog open={id !== null} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[825px]">
          <RoleForm
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

function RoleForm({
  formData,
  setFormData,
  handleSubmit,
  cancel,
}: {
  formData: {
    role: string,
    permission: string
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    role: string,
    permission: string
  }>>;
  handleSubmit: (e: React.FormEvent) => void;
  cancel: () => void;
}) {
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogDescription>Ubah data role dan klik simpan untuk memperbarui.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 mt-4">
        <div className="grid gap-3">
          <Label htmlFor="name">
            Nama Role <span className="text-red-500">*</span>
          </Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            placeholder="Role"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="description">
            Permission <span className="text-red-500">*</span>
          </Label>
          <Input
            id="permission"
            name="permission"
            value={formData.permission}
            onChange={(e) =>
              setFormData({ ...formData, permission: e.target.value })
            }
            placeholder="Permission"
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
