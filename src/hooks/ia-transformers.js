let classifier = null;

export async function getClassifier(setStatus) {
    if (!classifier) {
        if (setStatus) {
            setStatus('Descargando modelo de IA (solo la primera vez puede tardar unos segundos)...');
        }
        const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.8.0');
        classifier = await pipeline('zero-shot-classification', 'Xenova/nli-deberta-v3-xsmall');
    }
    return classifier;
}