export const chunkText=(text, chunkSize = 500, overlap = 100) => {
    const chunks = [];
    let start = 0;
    while(start < text.length){
        const end = start + chunkSize;
        chunks.push(text.slice(start, end));
        start = end - overlap; // Move back by overlap for the next chunk
    }
    return chunks;
}