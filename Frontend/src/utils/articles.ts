export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

//Function to create a cropped image from the original
export  const createCroppedImage = async (
        imageSrc: string,
        pixelCrop: CropArea
    ): Promise<string> => {
        return new Promise((resolve) => {
            const image = document.createElement('img');
            image.src = imageSrc;

            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    throw new Error('No 2d context');
                }

                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;

                ctx.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );

                resolve(canvas.toDataURL('image/jpeg'));
            };
        });
    };