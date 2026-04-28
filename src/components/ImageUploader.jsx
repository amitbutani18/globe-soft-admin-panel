import React, { useState, useRef } from 'react';
import { X, RefreshCw } from 'lucide-react';

const ImageUploader = ({
    folderName,
    value,
    onChange, // Callback that receives the final live objectUrl
    label = "Upload Image",
    className = ""
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);

        try {
            // STEP 1: Request Presigned URL from Backend
            const presignRes = await fetch('https://shark-app-l2rx4.ondigitalocean.app/api/upload/presigned-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type || 'image/png',
                    folderName: folderName || 'Uncategorized'
                })
            });

            const presignData = await presignRes.json();

            if (!presignData.success || !presignData.presignedUrl) {
                throw new Error(presignData.message || 'Failed to obtain presigned URL');
            }

            const { presignedUrl, objectUrl } = presignData;

            // STEP 2: Upload Binary File to DigitalOcean Spaces via Presigned URL
            const uploadRes = await fetch(presignedUrl, {
                method: 'PUT',
                headers: {
                    'x-amz-acl': 'public-read',
                    'Content-Type': file.type || 'image/png'
                },
                body: file
            });

            if (!uploadRes.ok) {
                throw new Error('Failed to upload the file to the storage provider');
            }

            // STEP 3: Return the live Public Object URL to parent state
            if (onChange) {
                onChange(objectUrl);
            }

        } catch (error) {
            console.error("🚀 Upload error:", error);
            alert("Error uploading image: " + error.message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset file input
            }
        }
    };

    const handleRemove = () => {
        if (onChange) onChange('');
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{label}</label>

            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    ref={fileInputRef}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-emerald-500 outline-none transition-all font-semibold file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {isUploading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-white dark:bg-zinc-900 px-2 rounded">
                        <RefreshCw className="w-4 h-4 animate-spin" /> Uploading...
                    </div>
                )}
            </div>

            {value && !isUploading && (
                <div className="mt-2 relative w-24 h-24 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden group/prev">
                    <img src={value} className="w-full h-full object-cover" alt="Preview" />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-1 right-1 p-1 bg-rose-500/90 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover/prev:opacity-100 transition-all shadow-md"
                        title="Remove Image"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
