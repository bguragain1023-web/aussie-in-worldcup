export const chunkText=(text, title) => {
    const chunks = [];
    const paragraphs = text.split("\n\n").map(p=>p.trim()).filter(p=>p.length > 0);// split paragraph and removee extra spaces and empty paragraphs

  for (let i =0; i< paragraphs.length; i++){
    const currentParagraph = paragraphs[i];
    const nextParagraph = paragraphs[i+1] || "";
    const combinedParagraph = nextParagraph ? `${currentParagraph}\n\n${nextParagraph}` : currentParagraph;

    chunks.push(`${title} \n\n ${combinedParagraph}`);
  }
    return chunks;
}