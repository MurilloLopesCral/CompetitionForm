import { Trash2 } from "lucide-react";
import React from "react";
import { TableRow as TableRowType } from "../types/FormTypes";

interface TableRowProps {
    row: TableRowType;
    index: number;
    onUpdateRow: (
        id: string,
        field: keyof Omit<TableRowType, "id">,
        value: string
    ) => void;
    onDeleteRow: (id: string) => void;
    isDeleteDisabled: boolean;
}

export const TableRow: React.FC<TableRowProps> = ({
    row,
    index,
    onUpdateRow,
    onDeleteRow,
    isDeleteDisabled
}) => {
    const formatValor = (value: string) => {
        const cleanValue = value.replace(/\D/g, "");
        const numberValue = parseInt(cleanValue) / 100;
        return numberValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    };

    const handlePrecoConcorrenteChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const formattedValor = formatValor(e.target.value);
        onUpdateRow(row.id, "precoConcorrente", formattedValor);
    };

    const handlePrecoCralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValor = formatValor(e.target.value);
        onUpdateRow(row.id, "precoCral", formattedValor);
    };

    return (
        <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
            <td className="p-3">
                <span className="text-blue-400 font-medium">{index + 1}</span>
            </td>
            <td className="p-3">
                <input
                    type="text"
                    value={row.codigoConcorrente}
                    onChange={(e) =>
                        onUpdateRow(row.id, "codigoConcorrente", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Digite o código do concorrente"
                />
            </td>
            <td className="p-3">
                <input
                    type="text"
                    value={row.precoConcorrente}
                    onChange={handlePrecoConcorrenteChange}
                    maxLength={14}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="R$ 0,00"
                />
            </td>
            <td className="p-3">
                <input
                    type="text"
                    value={row.codigoCral}
                    onChange={(e) =>
                        onUpdateRow(row.id, "codigoCral", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Código do CRAL"
                />
            </td>
            <td className="p-3">
                <input
                    type="text"
                    value={row.precoCral}
                    onChange={handlePrecoCralChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="R$ 0,00"
                />
            </td>
            <td className="p-3">
                <input
                    type="text"
                    value={row.comentario}
                    onChange={(e) =>
                        onUpdateRow(row.id, "comentario", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Comentário opcional"
                />
            </td>

            <td className="p-3">
                <button
                    type="button"
                    onClick={() => onDeleteRow(row.id)}
                    disabled={isDeleteDisabled}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remover linha"
                >
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};
