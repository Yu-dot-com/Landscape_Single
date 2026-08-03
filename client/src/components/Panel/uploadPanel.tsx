import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiUploadCloud } from "react-icons/fi";
import { useAddAsset, useGetCategory } from "../../hooks/useAsset";
import { zodResolver } from "@hookform/resolvers/zod";
import { assetSchema } from "../../schemas/assetSchema";
import { useToastStore } from "../../stores/useToastStore";
interface UploadFormData {
  name: string;
  category_id: string;
  subcategory_id: string;
}

export default function UploadPanel() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(assetSchema),
  });

  const { data: assetCategory, isLoading: Loadingcategory } = useGetCategory();
  const addToast = useToastStore((state) => state.addToast);

  const Category = assetCategory as any;
  const { mutate } = useAddAsset();

  useEffect(() => {
    if (Category && Category.length > 0 && !selectedCategory) {
      const firstCategory = Category[0].category_id;

      setSelectedCategory(firstCategory);

      setValue("category_id", firstCategory);

      if (Category[0].subcategories.length > 0) {
        setValue("subcategory_id", Category[0].subcategories[0].id);
      }
    }
  }, [Category, selectedCategory, setValue]);

if (Loadingcategory) {
  return (
    <div className="w-85 bg-bg rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center justify-center min-h-70">
      <div className="relative w-10 h-10 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-gray-100" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6B7A58] animate-spin" />
      </div>
      <p className="text-xs font-medium text-gray-500 tracking-wide">
        Loading categories
      </p>
      <div className="flex gap-1 mt-2">
        <span className="w-1 h-1 rounded-full bg-[#6B7A58]/60 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1 h-1 rounded-full bg-[#6B7A58]/60 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1 h-1 rounded-full bg-[#6B7A58]/60 animate-bounce" />
      </div>
    </div>
  );
}

  if (!Category || Category.length === 0) {
    return <p>Category list is empty</p>;
  }

  const currentCategory = Category.find(
    (category: any) => category.category_id === selectedCategory,
  );

  const subcategories = currentCategory?.subcategories ?? [];
  //   try {
  //     // 1. Prepare the FormData for Cloudinary
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  //     const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  //     // 2. Upload directly to Cloudinary's API
  //     const response = await fetch(
  //       https://api.cloudinary.com/v1_1/${cloudName}/image/upload,
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to upload image to Cloudinary");
  //     }

  //     const result = await response.json();
  //     const imageUrl = result.secure_url; // This is your returned URL!

  //     // 3. Send all form data, including the image URL, to your database
  //     mutate(
  //       {
  //         ...data,
  //         image: imageUrl, // Matches the image string field in your Zod schema
  //       },
  //       {
  //         onSuccess: () => {
  //           alert("Asset created successfully!");
  //           reset();
  //           setFile(null);
  //         },
  //         onError: (error) => {
  //           console.error("Database save failed:", error);
  //           alert("Failed to save asset info to database.");
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     alert("An error occurred during file upload.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };

const onSubmit = async (data: UploadFormData) => {
  if (!file) {
    addToast({
      type: "error",
      title: "No file selected",
      message: "Please select an image before uploading.",
    });
    return;
  }

  setUploading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    );

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      throw new Error("Failed to upload image to Cloudinary.");
    }

    const result = await res.json();

    const deleteToken = result.delete_token;
    const imageUrl = result.secure_url;

    mutate(
      {
        ...data,
        image_path: imageUrl,
        width: 100,
        height: 100,
        min_width: 40,
        max_width: 300,
        min_height: 40,
        max_height: 300,
      },
      {
        onSuccess: () => {
          addToast({
            type: "success",
            title: "Asset uploaded",
            message: `"${data.name}" has been added successfully.`,
          });

          reset();
          setFile(null);
        },

        onError: async (error: any) => {
          console.error("Database save failed:", error);

          addToast({
            type: "error",
            title: "Upload failed",
            message:
              error?.message ||
              "Failed to save asset information.",
          });

          // Roll back uploaded image from Cloudinary
          if (deleteToken) {
            try {
              const deleteFormData = new FormData();
              deleteFormData.append("token", deleteToken);

              await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`,
                {
                  method: "POST",
                  body: deleteFormData,
                },
              );

              console.log("Cloudinary image successfully rolled back.");
            } catch (deleteError) {
              console.error(
                "Failed to delete image from Cloudinary:",
                deleteError,
              );
            }
          }
        },
      },
    );
  } catch (error: any) {
    console.error("Upload error:", error);

    addToast({
      type: "error",
      title: "Upload failed",
      message:
        error?.message ||
        "An unexpected error occurred while uploading the image.",
    });
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="w-85 bg-bg rounded-2xl border border-gray-100 shadow-sm p-5 font-sans text-gray-800">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">
          Add Asset Information
        </h2>

        <p className="text-[11px] text-gray-400 mt-0.5">
          Upload asset configuration parameters to the catalog database.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-gray-600">
            Asset Name
          </label>

          <input
            placeholder="e.g. Oak Tree"
            {...register("name", {
              required: true,
            })}
            className="w-full h-9 rounded-xl bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white px-3 text-xs outline-none transition placeholder-gray-300"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Category and Subcategory */}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600">
              Category
            </label>
            <select
              {...register("category_id")}
              value={selectedCategory}
              onChange={(e) => {
                const value = e.target.value;

                setSelectedCategory(value);

                setValue("category_id", value);

                const category = Category.find(
                  (cat: any) => cat.category_id === value,
                );

                if (category?.subcategories.length) {
                  setValue("subcategory_id", category.subcategories[0].id);
                }
              }}
              className="w-full h-9 rounded-xl bg-gray-50 border border-transparent px-2.5 text-xs outline-none cursor-pointer text-gray-700"
            >
              {Category.map((category: any) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-sm">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-gray-600">
              Subcategory
            </label>
            <select
              {...register("subcategory_id")}
              className="w-full h-9 rounded-xl bg-gray-50 border border-transparent px-2.5 text-xs outline-none cursor-pointer text-gray-700"
            >
              {subcategories.map((sub: any) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            {errors.subcategory_id && (
              <p className="text-red-500 text-sm">
                {errors.subcategory_id.message}
              </p>
            )}
          </div>
        </div>

        {/* File Upload */}

        <div className="pt-1">
          <div className="border border-dashed border-gray-200 hover:border-gray-300 rounded-xl py-3 text-center bg-gray-50/40 relative transition group cursor-pointer">
            <input
              type="file"
              accept="image/*,.svg"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <div className="flex flex-col items-center justify-center">
              <FiUploadCloud size={16} className="text-gray-400" />

              <p className="text-xs font-medium text-gray-600 mt-1 truncate">
                {file ? (
                  <span className="text-[#6B7A58] font-semibold">
                    {file.name}
                  </span>
                ) : (
                  "Choose image or drag & drop"
                )}
              </p>
              {!file && (
                <p className="text-[9px] text-gray-400">
                  PNG, JPG, SVG up to 50MB
                </p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full h-10 rounded-xl bg-[#6B7A58] hover:bg-[#5b694b] active:scale-[0.99] text-white text-xs font-semibold shadow-sm transition disabled:bg-gray-100 disabled:text-gray-400"
        >
          {uploading ? "Saving Asset..." : "Upload Asset Template"}
        </button>
      </form>
    </div>
  );
}
