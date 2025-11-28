"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { addRole } from "../actions";

interface AddModalProps {
  onSuccess: () => void
}

export default function AddModal({ onSuccess }: AddModalProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    permission: ""
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.role.trim()) {
      toastr.error("Role wajib diisi");
      return;
    }
    try {
      await addRole(formData);
      toastr.success("Berhasil simpan access");
      setDialogOpen(false);
      setFormData({
        role: "",
        permission: ""
      });
      onSuccess();
    } catch (error) {
      console.log("Gagal menyimpan ", error);
      toastr.error("Gagal menyimpan access");
    }
  }

  const cancel = async () => {
    setFormData({
      role: "",
      permission: ""
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
              {/* Role */}
              <div className="grid gap-3">
                <Label htmlFor="role">Nama Role <span className="text-red-500">*</span></Label>
                <Input id="role" name="role" onChange={e => setFormData({ ...formData, role: e.target.value })} placeholder="Role" />
              </div>
              {/* Permission */}
              <div className="grid gap-3">
                <Label htmlFor="permission">Permission <span className="text-red-500">*</span></Label>
                <Input id="permission" name="permission" onChange={e => setFormData({ ...formData, permission: e.target.value })} placeholder="Permission" />
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
