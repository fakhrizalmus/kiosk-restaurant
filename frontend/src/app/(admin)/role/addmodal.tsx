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
import { motion, AnimatePresence } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"

interface AddModalProps {
  onSuccess: () => void
}

export default function AddModal({ onSuccess }: AddModalProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

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
    const selectedPermissions = Object.keys(checkedItems).filter(
      (id) => checkedItems[id] === true
    )
    try {
      await addRole({
        ...formData,
        permission: JSON.stringify(selectedPermissions) // atau array
      })
      toastr.success("Berhasil simpan access");
      setDialogOpen(false);
      setFormData({
        role: "",
        permission: ""
      });
      setCheckedItems({});
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
    setCheckedItems({});
  }

  const options = [
    { id: 1, label: "Enable notifications" },
    { id: 2, label: "Email updates" },
    { id: 3, label: "Automatic backup" },
  ]
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
                {/* <Label htmlFor="permission">Permission <span className="text-red-500">*</span></Label>
                <Input id="permission" name="permission" onChange={e => setFormData({ ...formData, permission: e.target.value })} placeholder="Permission" /> */}
                {options.map((item) => (
                  <Label
                    key={item.id}
                    htmlFor={item.id}
                    className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3
                               has-[[aria-checked=true]]:border-blue-600
                               has-[[aria-checked=true]]:bg-blue-50"
                  >
                    <motion.div
                      animate={{
                        scale: checkedItems[item.id] ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.15 }}
                    >
                      <Checkbox
                        id={item.id}
                        checked={checkedItems[item.id] || false}
                        onCheckedChange={(value) =>
                          setCheckedItems((prev) => ({ ...prev, [item.id]: value === true }))
                        }
                        className="data-[state=checked]:border-blue-600
                                   data-[state=checked]:bg-blue-600
                                   data-[state=checked]:text-white"
                      />
                    </motion.div>
              
                    <div className="grid gap-1.5 font-normal">
                      <p className="text-sm leading-none font-medium">{item.label}</p>
                    </div>
                  </Label>
                ))}
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
