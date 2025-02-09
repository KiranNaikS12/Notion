import { JSONContent } from '@tiptap/react';

export interface EditorNode {
    type: string;
    attrs?: {
        src?: string;
        [key: string]: unknown;
    };
    content?: EditorNode[];
}

export interface EditorContent {
    type: 'doc';
    content: EditorNode[];
}

export const compressImage = async (base64String: string, maxWidth = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64String;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }
            
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compress as JPEG with 0.7 quality
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            resolve(compressedBase64);
        };
        
        img.onerror = (error) => reject(error);
    });
};

// Function to extract images from editor content
export const extractImagesFromContent = (content: JSONContent): string[] => {
    const images: string[] = [];
    
    const traverse = (node: JSONContent): void => {
        if (node.type === 'image' && node.attrs?.src) {
            images.push(node.attrs.src);
        }
        if (node.content) {
            node.content.forEach(traverse);
        }
    };
    
    traverse(content)
    return images;
};

export const replaceImageSources = (
    content: JSONContent, 
    imageMap: Map<string, string>
): EditorContent => {
    // Create deep copy of content to avoid mutating original
    const newContent: EditorContent = JSON.parse(JSON.stringify(content));
    
    const traverse = (node: EditorNode): void => {
        if (node.type === 'image' && node.attrs?.src) {
            const newSrc = imageMap.get(node.attrs.src);
            if (newSrc) {
                node.attrs.src = newSrc;
            }
        }
        if (node.content) {
            node.content.forEach(traverse);
        }
    };
    
    newContent.content.forEach(traverse);
    return newContent;
};