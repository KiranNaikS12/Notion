import React, { useEffect, useRef, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import { handleApiError } from '../types/APIResponse'
import { useNavigate, useParams } from 'react-router-dom'
import { baseUrl } from '../utils/baseUrl'
import axios from 'axios'
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Image as TipTapImage } from "@tiptap/extension-image"
import { Button } from "@heroui/react"
import { Formik, Form, Field } from 'formik'
import { interestsList } from "../utils/lists"
import Cropper from "react-easy-crop"
import { createCroppedImage, CropArea } from "../utils/articles"
import { compressImage, extractImagesFromContent, replaceImageSources } from "../utils/imageCompression"
import { toast, Toaster } from "sonner"
import { articleFormValidation } from "../validations/articleValidation"

interface Article {
    title: string;
    category: string;
    content: string;
    coverImage?: string;
}

interface FormValues {
    title: string;
    category: string;
    coverImage: string;
}

const UpdateArticle: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image handling states
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [showCropper, setShowCropper] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
    const [aspectRatio, setAspectRatio] = useState(1);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TipTapImage.extend({
                addAttributes() {
                    return {
                        src: {},
                        width: {
                            default: '600px',
                        },
                    };
                },
            }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none p-4 rounded-lg border border-gray-500',
            },
        },
    });

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`${baseUrl}article/${
                    id}`, {
                    withCredentials: true
                });
                const articleData = response?.data?.data;
                setArticle(articleData);
                
                // Set the editor content from the fetched article
                if (editor && articleData.content) {
                    editor.commands.setContent(JSON.parse(articleData.content));
                }

                // Set cover image if exists
                if (articleData.coverImage) {
                    setCoverImage(articleData.coverImage);
                }
            } catch (error) {
                handleApiError(error);
            }
        };
        fetchArticle();
    }, [id, editor]);

    const handleSubmit = async (values: FormValues) => {
        try {
            setIsSubmitting(true);

            const editorContent = editor?.getJSON();
            if (!editorContent) {
                throw new Error('No editor content');
            }

            // Extract and compress all images from editor content
            const contentImages = extractImagesFromContent(editorContent);
            const imageMap = new Map<string, string>();

            await Promise.all(
                contentImages.map(async (imgSrc) => {
                    const compressed = await compressImage(imgSrc);
                    imageMap.set(imgSrc, compressed);
                })
            );

            const updatedContent = replaceImageSources(editorContent, imageMap);

            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('category', values.category);
            formData.append('content', JSON.stringify(updatedContent));

            if (coverImage && !coverImage.startsWith('http')) {
                // Only append if it's a new image (not a URL)
                const response = await fetch(coverImage);
                const blob = await response.blob();
                formData.append('coverImage', blob, 'cover-image.jpg');
            }

            const response = await axios.put(`${baseUrl}article/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            if (response) {
                toast.success(response?.data?.message);
                setTimeout(() => {
                    navigate('/articles');
                }, 2000);
            }

        } catch (error) {
            handleApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Image handling functions
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                editor?.chain().focus().setImage({ src: base64 }).run();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setImageSrc(result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (_: { x: number; y: number; width: number; height: number }, croppedAreaPixels: CropArea) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleCropConfirm = async () => {
        if (imageSrc && croppedAreaPixels) {
            try {
                const croppedImage = await createCroppedImage(imageSrc, croppedAreaPixels);
                setCoverImage(croppedImage);
                setShowCropper(false);
                setImageSrc(null);
            } catch (error) {
                console.error('Error cropping image:', error);
            }
        }
    };

    if (!article) return <div>Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Toaster position="top-center" richColors />
            <HomeHeader />
            <div>
                <div className="border border-gray-400 border-b-1"></div>
            </div>
            <div className="ml-[220px] mt-16 mr-[225px] mb-2">
                <h1 className="flex flex-col gap-1 mb-6 text-2xl font-bold text-gray-600">
                    Update Article
                </h1>
                <Formik
                    initialValues={{
                        title: article.title || '',
                        category: article.category || '',
                        coverImage: '',
                    }}
                    validationSchema={articleFormValidation}
                    validateOnMount={true}
                    validateOnChange={false}
                    validateOnBlur={true}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isValid }) => (
                        <Form>
                            <div className="flex flex-col space-y-7">
                                {/* Title Input */}
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="title" 
                                        className={`block mb-2 text-sm font-medium ${
                                            errors.title && touched.title
                                                ? 'text-red-500'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {`${errors.title && touched.title ? '*' + errors.title : 'Title'}`}
                                    </label>
                                    <Field
                                        type="text"
                                        placeholder="Enter Article Title..."
                                        name="title"
                                        className="w-full p-2 border border-gray-300 rounded-lg shadow-lg bg-gradient-to-b from-gray-50 to-gray-200"
                                    />
                                </div>

                                {/* Category Select */}
                                <div className="flex flex-col space-y-2">
                                    <label htmlFor="category" className="text-gray-500">
                                        Article Category
                                    </label>
                                    <Field
                                        as="select"
                                        id="category"
                                        name="category"
                                        className="w-full p-2 border border-gray-300 rounded-lg shadow-lg bg-gradient-to-b from-gray-50 to-gray-200"
                                    >
                                        <option value="" disabled>Select a Category</option>
                                        {interestsList.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </Field>
                                </div>

                                {/* Cover Image Upload */}
                                <label className="block mb-4">
                                    <span className="text-gray-500">Update Cover Image:</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverImageUpload}
                                        className="block w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-lg bg-gradient-to-b from-gray-50 to-gray-200"
                                    />
                                </label>

                                {/* Cropper Modal */}
                                {showCropper && imageSrc && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="relative w-[600px] h-[550px] bg-white p-4 rounded-lg">
                                            <div className="relative h-[400px]">
                                                <Cropper
                                                    image={imageSrc}
                                                    crop={crop}
                                                    zoom={zoom}
                                                    aspect={aspectRatio}
                                                    onCropChange={setCrop}
                                                    onZoomChange={setZoom}
                                                    onCropComplete={handleCropComplete}
                                                />
                                            </div>
                                            <div className="flex items-center mt-4 space-x-2 cursor-pointer">
                                                <h1>Select Ratio</h1>
                                                {[
                                                    { ratio: 1, label: "1:1" },
                                                    { ratio: 16/9, label: "16:9" },
                                                    { ratio: 4/3, label: "4:3" },
                                                    { ratio: 3/2, label: "3:2" },
                                                    { ratio: 3/1, label: "3:1" },
                                                    { ratio: 5/3, label: "5:3" },
                                                    { ratio: 5/4, label: "5:4" }
                                                ].map(({ ratio, label }) => (
                                                    <div
                                                        key={label}
                                                        onClick={() => setAspectRatio(ratio)}
                                                        className="flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full hover:bg-button hover:text-white"
                                                    >
                                                        {label}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end mt-4 space-x-2">
                                                <Button
                                                    color="danger"
                                                    variant="light"
                                                    onPress={() => {
                                                        setShowCropper(false);
                                                        setImageSrc(null);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    color="primary"
                                                    onPress={handleCropConfirm}
                                                >
                                                    Crop Image
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Cover Image Preview */}
                                {coverImage && (
                                    <div className="w-[300px] mb-4">
                                        <img
                                            src={coverImage}
                                            alt="Cover Preview"
                                            className="object-cover w-full h-48 rounded-lg"
                                        />
                                    </div>
                                )}

                                {/* Content Editor Toolbar */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-gray-500">
                                        You can use this option to dynamically upload images in your article:
                                    </span>
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <Button onPress={() => fileInputRef.current?.click()}>
                                            Upload Image
                                        </Button>
                                    </label>
                                </div>

                                {/* TipTap Editor */}
                                <div className="border rounded-lg">
                                    <div className="overflow-y-auto">
                                        <EditorContent editor={editor} className="p-2" />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end mb-2 space-x-2">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        disabled={!isValid || isSubmitting || !editor?.getText().trim()}
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update Article'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default UpdateArticle;