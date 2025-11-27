"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { addPermission } from "../actions";

interface AddModalProps {
  onSuccess: () => void
}

export default function AddModal({ onSuccess }: AddModalProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name.trim()) {
      toastr.error("Nama access wajib diisi");
      return;
    }
    try {
      await addPermission(formData);
      toastr.success("Berhasil simpan access");
      setDialogOpen(false);
      setFormData({
        name: "",
        description: ""
      });
      onSuccess();
    } catch (error) {
      console.log("Gagal menyimpan ", error);
      toastr.error("Gagal menyimpan access");
    }
  }

  const cancel = async () => {
    setFormData({
      name: "",
      description: ""
    })
  }
  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-3 bg-green-400 w-fit" onClick={() => setDialogOpen(true)}>
            <IconPlus />Tambah Access
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[825px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Tambah Access</DialogTitle>
              <DialogDescription>
                Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              {/* Nama */}
              <div className="grid gap-3">
                <Label htmlFor="name">Nama Access <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nama" />
              </div>
              {/* Deskripsi */}
              <div className="grid gap-3">
                <Label htmlFor="description">Deskripsi <span className="text-red-500">*</span></Label>
                <Input id="description" name="description" onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Deskripsi" />
              </div>
            </div>
            <div className="mt-4">
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="bg-red-500 text-white" onClick={cancel}>Batal</Button>
                </DialogClose>
                <Button type="submit" className="bg-green-400 text-white">Simpan</Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}