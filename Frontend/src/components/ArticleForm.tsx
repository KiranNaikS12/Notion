import React, { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image as TipTapImage } from "@tiptap/extension-image";
import { interestsList } from "../utils/lists";
import { Button } from "@heroui/react";
import HomeHeader from "./HomeHeader";
import Cropper from "react-easy-crop";
import { createCroppedImage, CropArea } from "../utils/articles";
import { Field, Form, Formik, FormikHelpers } from "formik";
import axios from "axios";
import { handleApiError } from "../types/APIResponse";
import { compressImage,   extractImagesFromContent, replaceImageSources } from "../utils/imageCompression";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { articleFormValidation } from "../validations/articleValidation";

interface FormValues {
    title: string;
    category: string;
    coverImage: string;
}

const ArticleForm: React.FC = () => {
    const { userInfo } = useSelector((state: RootState) => state.user);
    const id = userInfo?._id;
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSubheading, setIsSubheading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    //new states for cropping Images
    const [showCropper, setShowCropper] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
    const [aspectRatio, setAspectRatio] = useState(1);
    const navigate = useNavigate()


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
        content: "Write Content Here...",
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none p-4 rounded-lg border border-gray-500',
            },
        },
    });

    const resetForm = () => {
        setCoverImage(null);
        setImageSrc(null);
        setShowCropper(false);
        setCroppedAreaPixels(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    //Handle article submission
    const handleSubmit = async ( values: FormValues, { setSubmitting, resetForm: formikResetForm }: FormikHelpers<FormValues>) => {
        try {
            setIsSubmitting(true);

            const editorContent = editor?.getJSON();
            if (!editorContent) {
                throw new Error('No editor content');
            }
            // Extract and compress all images from editor content
            const contentImages = extractImagesFromContent(editorContent);
            const imageMap = new Map<string, string>();

            // Compress all content images
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

            if (coverImage) {
                // Convert base64 to blob
                const response = await fetch(coverImage);
                const blob = await response.blob();
                formData.append('coverImage', blob, 'cover-image.jpg');

            }

            const response = await axios.post(`http://localhost:5000/api/upload/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            })

            if (response) {
                formikResetForm();
                editor?.commands.setContent('Write Content Here...');
                resetForm();
                toast.success(response?.data?.message)
                setTimeout(() => {
                    navigate('/home')
                },2000)
                
            }

        } catch (error) {
            handleApiError(error)
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    }


    // Function to upload image locally
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('clicked')
        const fileInput = event.target;
        const file = fileInput.files?.[0];


        if (file) {
            const readFile = new FileReader();
            readFile.onload = () => {
                const base64 = readFile.result as string;
                editor?.chain().focus().setImage({ src: base64 }).run();
            };
            readFile.readAsDataURL(file);
        }
    };

    // function  for setting sub heading..
    const addSubheading = () => {
        if (!editor) return;

        editor.chain().focus().toggleHeading({ level: 2 }).toggleBold().run();

        setTimeout(() => {
            setIsSubheading(editor.isActive("heading", { level: 2 }));
        }, 300);
    };

    // Handle the completion of cropping
    const handleCropComplete = (_: { x: number; y: number; width: number; height: number }, croppedAreaPixels: CropArea) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    //hanlde cover Image Upload
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

    return (
        <div className="flex flex-col min-h-screen">
             <Toaster 
               position='top-center'
               richColors
            />
            <HomeHeader />
            <div>
                <div className="border border-gray-400 border-b-1"></div>
            </div>
            <div className="ml-[220px] mt-16 mr-[225px] mb-2">
                <>
                    <h1 className="flex flex-col gap-1 mb-6 text-2xl font-bold text-gray-600">Publish Article</h1>
                    <Formik
                        initialValues={{
                            title: '',
                            category: '',
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
                                    {/* Main Heading Input */}
                                    <div className="flex flex-col space-y-2">
                                        <label htmlFor="title" 
                                            className={`block mb-2 text-sm font-medium  ${errors.title && touched.title
                                                ? 'text-red-500'
                                                : 'text-gray-500'
                                                }`}>{`${errors.title && touched.title ? '*' + errors.title : 'Title'}`}
                                            
                                        </label>
                                        <Field
                                            type="text"
                                            placeholder="Enter Article Title..."
                                            name="title"
                                            className="w-full p-2 border border-gray-300 rounded-lg shadow-lg bg-gradient-to-b from-gray-50 to-gray-200"
                                        />
                                    </div>

                                    {/* Select Category */}
                                    <div className="flex flex-col space-y-2">
                                        <label htmlFor="category" className="text-gray-500" >Article Category</label>
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
                                        <span className="text-gray-500">Upload Cover Image:</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name="coverImage"
                                            onChange={handleCoverImageUpload}
                                            className="block w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-lg bg-gradient-to-b from-gray-50 to-gray-200"
                                        />
                                    </label>

                                    {/* Cropper Modal */}
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
                                                        style={{
                                                            containerStyle: {
                                                                width: '100%',
                                                                height: '100%',
                                                                position: 'relative'
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-center mt-4 space-x-2 cursor-pointer">
                                                    <h1>Select Ratio</h1>
                                                    <div onClick={() => setAspectRatio(1)} className="flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full hover:bg-button hover:text-white">1:1</div>
                                                    <div onClick={() => setAspectRatio(16 / 9)} className="flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full hover:bg-button hover:text-white">16:9</div>
                                                    <div onClick={() => setAspectRatio(4 / 3)} className="flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full hover:bg-button hover:text-white">4:3</div>
                                                    <div onClick={() => setAspectRatio(3 / 2)} className="flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full hover:bg-button hover:text-white">3:2</div>
                                                    <div onClick={() => setAspectRatio(3 / 1)} className="flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full hover:bg-button hover:text-white">3:1</div>
                                                    <div onClick={() => setAspectRatio(5 / 3)} className="flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full hover:bg-button hover:text-white">5:3</div>
                                                    <div onClick={() => setAspectRatio(5 / 4)} className="flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full hover:bg-button hover:text-white">5:4</div>
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

                                    {/* Show Cover Image Preview */}
                                    {coverImage && (
                                        <div className="w-[300px] mb-4">
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
                                        <Button
                                            type="submit"
                                            color="primary"
                                            disabled={!isValid || isSubmitting || !editor?.getText().trim()}
                                        >
                                            {isSubmitting ? 'Uploading...' : 'Save Article'}
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </>
            </div>
        </div>
    );
};

export default ArticleForm;
