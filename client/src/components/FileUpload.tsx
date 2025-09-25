import { FileText, Upload, X } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import React, { useRef, useState } from "react";
import { MessageBox } from "./ui/MessageBox"; // ajuste caminho

GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface FileUploadProps {
    file: File | null;
    onFileSelect: (file: File | null) => void;
    error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    file,
    onFileSelect,
    error
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            try {
                const arrayBuffer = await selectedFile.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer })
                    .promise;
                const metaData: any = await pdf.getMetadata();
                const producer = metaData?.info?.Producer || null;

                if (producer && producer.includes("Microsoft: Print To PDF")) {
                    setErrorMessage(
                        "📄 Documento em um formato não permitido (PDF OCR). Por favor, envie o formulário com a opção 'Sem comprovante' preenchendo os dados necessários."
                    );
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                    return;
                }

                setErrorMessage(null);
                onFileSelect(selectedFile);
            } catch (err) {
                console.error("Erro ao ler metadados do PDF:", err);
                setErrorMessage(null);
                onFileSelect(selectedFile);
            }
        } else if (selectedFile) {
            setErrorMessage("⚠️ Por favor, selecione apenas arquivos PDF.");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemoveFile = () => {
        onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setErrorMessage(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "application/pdf") {
            onFileSelect(droppedFile);
        } else {
            setErrorMessage("⚠️ Por favor, selecione apenas arquivos PDF.");
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="space-y-4">
            <label className="block text-white font-medium">
                Anexar Arquivo PDF (Nota Fiscal){" "}
                <span className="text-red-400">*</span>
            </label>

            {!file ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer hover:border-blue-400 hover:bg-slate-800/50 ${
                        error || errorMessage
                            ? "border-red-500 bg-red-500/10"
                            : "border-slate-600"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="mx-auto mb-4 text-slate-400" size={48} />
                    <p className="text-slate-300 mb-2">
                        Clique ou arraste um arquivo PDF aqui
                    </p>
                    <p className="text-slate-500 text-sm">
                        Apenas arquivos PDF são aceitos
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            ) : (
                <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <FileText className="text-blue-400" size={24} />
                        <div>
                            <p className="text-white font-medium">
                                {file.name}
                            </p>
                            <p className="text-slate-400 text-sm">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Remover arquivo"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {(error || errorMessage) && (
                <MessageBox type="error" message={errorMessage || error!} />
            )}
        </div>
    );
};
