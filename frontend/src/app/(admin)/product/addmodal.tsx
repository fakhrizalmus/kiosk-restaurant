"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { addProduct, getCategory } from "../actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

interface AddModalProps {
  onSuccess: () => void
}

export default function AddModal({ onSuccess }: AddModalProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [harga, setHarga] = useState("");
    const [open, setOpen] = useState(false);
    const [id, setValue] = useState<number | null>(null);
    const [kategoriList, setKategoriList] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        price: 0
    })

    async function handleSubmit (e: React.FormEvent) {
        e.preventDefault();
        
        if (Object.keys(formData).length < 2) {
            toastr.error("Form wajib diisi semua");
            return;
        }
        if (!selectedFile) {
            toastr.error("Mohon pilih file gambar.");
            return;
        }
        if (id == 0) {
            toastr.error("Form wajib diisi semua");
            return;
        }
        try {
            const newFormData = {
                ...formData,
                category_id: id ?? 0,
                image: selectedFile
            };
            const addProduk = await addProduct(newFormData);
            setDialogOpen(false);
            setFormData({
                name: "",
                price: 0
            })
            setSelectedFile(null);
            setHarga("");
            onSuccess();
            setValue(null);
            toastr.success("Berhasil simpan produk");
        } catch (error) {
            console.log("Gagal menyimpan ", error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setHarga(parseInt(value || "0").toLocaleString("id-ID"))
        setFormData({ ...formData, price: parseInt(value || "0") })
    }

    useEffect(() => {
        const fetchKategori = async function () {
            const res = await getCategory({});

            setKategoriList(res.data.rows);
        }

        fetchKategori();
    }, []);

    const cancel = async () => {
        setFormData({
            name: "",
            price: 0
        })
        setSelectedFile(null);
        setHarga("");
        setValue(null);
    }
    return (
        <div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="mt-3 bg-green-400 w-fit" onClick={() => setDialogOpen(true)}>
                        <IconPlus />Add Pengeluaran
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[825px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Add Pengeluaran</DialogTitle>
                            <DialogDescription>
                                Click save when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            {/* Nama */}
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                                <Input id="name" name="name" onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nama" />
                            </div>
                            {/* Kategori */}
                            <div className="grid gap-3">
                                <Label htmlFor="name-1">Kategori <span className="text-red-500">*</span></Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full justify-between"
                                        >
                                            {id
                                                ? kategoriList.find((item) => item.id === id)?.name
                                                : "Pilih kategori..."}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari kategori..." className="h-9" />
                                            <CommandList>
                                                <CommandEmpty>No kategori found.</CommandEmpty>
                                                <CommandGroup>
                                                    {kategoriList.map((item) => (
                                                        <CommandItem
                                                            key={item.id}
                                                            value={item.id.toString()}
                                                            onSelect={(currentValue) => {
                                                                const selectedId = parseInt(currentValue)
                                                                setValue(selectedId === id ? null : selectedId)
                                                                setOpen(false)
                                                            }}
                                                        >
                                                            {item.name}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    id === item.id ? "opacity-100" : "opacity-0"
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
                                <Input id="image" name="name" type="file" 
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                    setSelectedFile(file)
                                    }
                                }} />
                            </div>
                            {/* Harga */}
                            <div className="flex gap-4">
                                <div className="grid gap-3 flex-1">
                                    <Label htmlFor="harga">Harga <span className="text-red-500">*</span></Label>
                                    <Input type="number" id="harga" name="harga" onChange={handleChange} />
                                </div>
                                <div className="grid gap-3 flex-1">
                                    <Label htmlFor="harga">Rupiah</Label>
                                    <Input id="harga" name="harga" value={harga} readOnly />
                                </div>
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