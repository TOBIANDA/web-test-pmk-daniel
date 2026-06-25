interface TruncateByWordsProps {
    text: string;
    wordLimit: number;
}

export const truncateByWords = ({ text, wordLimit }: TruncateByWordsProps): string => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...'
}