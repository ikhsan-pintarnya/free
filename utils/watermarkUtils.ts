/**
 * Generates a seamless watermark pattern.
 * Creates a canvas with repeated "pintarnya" text rotated diagonally.
 */
export const generateWatermarkOverlay = async (width: number, height: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Settings for the watermark text
            const text = 'pintarnya';
            const fontSize = Math.max(20, Math.floor(width / 20)); // Responsive font size
            ctx.font = `900 ${fontSize}px sans-serif`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'; // Semi-transparent white
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            // Calculate spacing
            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            const spacingX = textWidth * 1.5;
            const spacingY = fontSize * 3;

            // Rotation angle (e.g., -30 degrees)
            const angle = -30 * Math.PI / 180;

            // Draw repeated text
            // We draw a grid that covers the whole canvas, including rotation overflow
            ctx.save();
            ctx.rotate(angle);

            // Because of rotation, we need to cover a larger area to ensure the canvas is filled
            // Calculate diagonal to cover full rotation
            const diagonal = Math.sqrt(width * width + height * height);

            for (let y = -diagonal; y < diagonal; y += spacingY) {
                for (let x = -diagonal; x < diagonal; x += spacingX) {
                    // Stagger rows
                    const xOffset = (Math.floor(y / spacingY) % 2) === 0 ? 0 : spacingX / 2;
                    ctx.fillText(text, x + xOffset, y);
                }
            }

            ctx.restore();

            resolve(canvas.toDataURL('image/png'));
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Merges the base image with a watermark overlay.
 * Returns the final image as a base64 string (without the data: prefix if requested, but canvas.toDataURL returns with prefix).
 * The app handles the prefix stripping if needed, but this util returns standard Data URL.
 */
export const mergeWatermark = async (base64Image: string, mimeType: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Generate watermark pattern for this size
            const watermarkDataUrl = await generateWatermarkOverlay(img.width, img.height);
            const watermarkImg = new Image();

            watermarkImg.onload = () => {
                // Draw watermark on top
                ctx.drawImage(watermarkImg, 0, 0);

                // Return result
                // Use original mimeType if supported, else png
                resolve(canvas.toDataURL(mimeType));
            };

            watermarkImg.onerror = (e) => reject(e);
            watermarkImg.src = watermarkDataUrl;
        };

        img.onerror = (e) => reject(e);
        // Ensure base64 string is a full data URL for Image.src
        img.src = base64Image.startsWith('data:') ? base64Image : `data:${mimeType};base64,${base64Image}`;
    });
};
