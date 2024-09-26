export const handleNoImageError = ({ currentTarget }: { currentTarget: EventTarget }, imgUrl: string) => {
  const img = currentTarget as HTMLImageElement;
  img.onerror = null;
  img.src = imgUrl;
};
