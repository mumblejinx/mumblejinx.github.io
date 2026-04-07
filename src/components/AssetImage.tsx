import { useState } from 'react';

interface AssetImageProps {
  src: string;
  fallback: string;
  className?: string;
  textClassName?: string;
}

/**
 * A reusable component that displays an image with a text fallback.
 * To replace the text with a real image, simply place a file with the 
 * matching name (e.g., 'work.jpg') into the 'public/' folder.
 */
export const AssetImage = ({ src, fallback, className = '', textClassName = '' }: AssetImageProps) => {
  const [error, setError] = useState(false);

  // Default text color is white unless overridden by textClassName
  const finalTextColor = textClassName.includes('text-') ? '' : 'text-white';

  return (
    <div className="flex flex-col items-center justify-center">
      {!error && src ? (
        <img
          src={src}
          alt={fallback}
          className={className}
          referrerPolicy="no-referrer"
          onError={() => setError(true)}
        />
      ) : (
        <span className={`${finalTextColor} uppercase text-[10px] md:text-xs font-black tracking-widest whitespace-nowrap drop-shadow-md ${textClassName}`}>
          {fallback}
        </span>
      )}
    </div>
  );
};
