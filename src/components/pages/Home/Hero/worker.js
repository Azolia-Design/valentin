self.addEventListener('message', async (event) => {
    const { type, data } = event.data;

    if (type === 'init') {
        const { imageURLs } = data;
        const textures = await loadImages(imageURLs);

        self.postMessage({ type: 'initComplete', textures });
    }
});

// Hàm tải hình ảnh
async function loadImages(imageURLs) {
    const images = await Promise.all(imageURLs.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Image load error: ' + url));
            img.src = url;
        });
    }));
    return images;
}