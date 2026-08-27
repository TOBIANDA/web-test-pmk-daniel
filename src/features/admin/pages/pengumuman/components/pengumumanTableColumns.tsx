"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export type pengumuman = {
    id: string;
    judul: string;
    dibuat: string;
    publikasi: string;
    status: "Aktif" | "Terjadwal";
    category?: string;
    content?: string;
    author?: string;
    imageUrl?: string;
    views?: number;
};

interface GetColumnsOptions {
    onEdit?: (item: pengumuman) => void;
    onDelete?: (item: pengumuman) => void;
}

export const getColumns = (options: GetColumnsOptions = {}): ColumnDef<pengumuman>[] => [
    {
        accessorKey: "judul",
        header: "JUDUL PENGUMUMAN",
        cell: ({ row }) => {
            return (
                <Link
                    href={`/limarotiduaikan/${row.original.id}`}
                    className="font-plusJakarta font-bold text-base hover:underline text-slate-900 hover:text-primary transition-colors"
                >
                    {row.getValue("judul")}
                </Link>
            );
        },
    },
    {
        accessorKey: "dibuat",
        header: "DIBUAT",
        cell: ({ row }) => (
            <span className="font-plusJakarta text-sm text-slate-600">
                {row.getValue("dibuat")}
            </span>
        ),
    },
    {
        accessorKey: "publikasi",
        header: "PUBLIKASI",
        cell: ({ row }) => (
            <span className="font-plusJakarta text-sm text-slate-600">
                {row.getValue("publikasi")}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <div className="flex items-center gap-2">
                    <span
                        className={`h-2.5 w-2.5 rounded-full ${
                            status === "Aktif" ? "bg-emerald-600" : "bg-blue-600"
                        }`}
                    />
                    <span
                        className={`font-plusJakarta font-semibold text-sm ${
                            status === "Aktif" ? "text-emerald-700" : "text-blue-700"
                        }`}
                    >
                        {status}
                    </span>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "AKSI",
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex items-center gap-1">
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="w-9 h-9 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit Pengumuman"
                        onClick={() => options.onEdit?.(item)}
                    >
                        <Pencil className="size-4" />
                    </Button>
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="w-9 h-9 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Pengumuman"
                        onClick={() => options.onDelete?.(item)}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            );
        },
    },
];

// Fallback default columns
export const columns = getColumns();