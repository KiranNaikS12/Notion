import React, {  useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { interestsList } from "../utils/lists";
import { Button } from "@heroui/react";
import HomeHeader from "./HomeHeader";

const ArticleForm: React.FC = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubheading, setIsSubheading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        content: "Write Content Here...",
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none p-4 rounded-lg border border-gray-500',
            },
        },
    });


    // Function to upload image locally
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('clicked')
        const fileInput = event.target;
        const file = fileInput.files?.[0];

        console.log("File selected:", file);

        if (file) {
            const readFile = new FileReader();
            readFile.onload = () => {
                const base64 = readFile.result as string;
                editor?.chain().focus().setImage({ src: base64 }).run();
            };
            readFile.readAsDataURL(file);
        }
    };

    //hanlde cover Image Upload
    const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCoverImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    

    const addSubheading = () => {
        if (!editor) return;

        editor.chain().focus().toggleHeading({ level: 2 }).toggleBold().run();

        setTimeout(() => {
            setIsSubheading(editor.isActive("heading", { level: 2 }));
        }, 300);
    };


    return (
        <div className="flex flex-col min-h-screen ">
            <HomeHeader />
            <div>
                <div className="border border-gray-400 border-b-1"></div>
            </div>
            <div className="ml-[220px] mt-16 mr-[225px]">
                <>
                    <h1 className="flex flex-col gap-1 mb-6 text-2xl font-bold text-gray-600">Publish Article</h1>
                    <div className="flex flex-col space-y-7">
                        {/* Main Heading Input */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="title" className="text-gray-500">Article Title</label>
                            <input
                                type="text"
                                placeholder="Enter Article Title..."
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-lg bg-gradient-to-b from-gray-50 to-gray-200"
                            />
                        </div>

                        {/* Select Category */}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="category" className="text-gray-500" >Article Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg shadow-lg bg-gradient-to-b from-gray-50 to-gray-200"
                            >
                                <option value="" disabled>Select a Category</option>
                                {interestsList.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Cover Image Upload */}
                        <label className="block mb-4">
                            <span className="text-gray-500">Upload Cover Image:</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverImageUpload}
                                className="block w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-lg bg-gradient-to-b from-gray-50 to-gray-200"
                            />
                        </label>

                        {/* Show Cover Image Preview */}
                        {coverImage && (
                            <div className="mb-4">
                                <img
                                    src={coverImage}
                                    alt="Cover Preview"
                                    className="object-cover w-full h-48 rounded-lg"
                                />
                            </div>
                        )}

                        {/* Toolbar for Actions */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-500">Options: </span>
                            <Button onPress={addSubheading} >
                                {isSubheading ? "BOLD" : "NORMAL"}
                            </Button>
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <Button onPress={() => fileInputRef.current?.click()}
                                >Upload Image
                                </Button>
                            </label>
                        </div>

                        <div className="border rounded-lg">
                            <div className="overflow-y-auto">
                                <EditorContent
                                    editor={editor}
                                    className="p-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mb-2 space-x-2">
                            <Button color="danger" variant="light" >
                                Draft
                            </Button>
                            <Button color="primary">
                                Save Article
                            </Button>
                        </div>
                    </div>
                </>
            </div>
        </div>
    );
};

export default ArticleForm;
