export const truncateText = (text, maxLines) => {
    const hiddenMeasurer = document.getElementById('hidden-measurer');
    hiddenMeasurer.style.fontSize = fontSize;
    hiddenMeasurer.style.fontFamily = fontFamily;

    // Calculate the height of a single line of text
    hiddenMeasurer.textContent = 'A';
    const singleLineHeight = hiddenMeasurer.offsetHeight;

    const maxHeight = singleLineHeight * maxLines;
    hiddenMeasurer.textContent = '';
    let truncatedText = '';

    for (let i = 0; i < text.length; i++) {
        hiddenMeasurer.textContent += text[i];
        if (hiddenMeasurer.offsetHeight > maxHeight) {
        truncatedText = hiddenMeasurer.textContent.slice(0, -1) + '...';
        break;
        }

        truncatedText = hiddenMeasurer.textContent;
    }

    return truncatedText;
}