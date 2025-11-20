"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { addCategory } from "../actions";

interface AddModalProps {
  onSuccess: () => void
}

export default function AddModal({ onSuccess }: AddModalProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: ""
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.name.trim()) {
      toastr.error("Nama kategori wajib diisi");
      return;
    }
    try {
      await addCategory(formData);
      toastr.success("Berhasil simpan kategori");
      setDialogOpen(false);
      setFormData({ name: "" });
      onSuccess();
    } catch (error) {
      console.log("Gagal menyimpan ", error);
      toastr.error("Gagal menyimpan kategori");
    }
  }

  const cancel = async () => {
    setFormData({
      name: ""
    })
  }
  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-3 bg-green-400 w-fit" onClick={() => setDialogOpen(true)}>
            <IconPlus />Tambah Kategori
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[825px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Tambah Kategori</DialogTitle>
              <DialogDescription>
                Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              {/* Nama */}
              <div className="grid gap-3">
                <Label htmlFor="name">Nama Kategori <span className="text-red-500">*</span></Label>
                <Input id="name" name="name" onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nama" />
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