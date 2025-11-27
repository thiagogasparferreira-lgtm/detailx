interface StarRatingProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  showNumber?: boolean;
}

export default function StarRating({ rating, size = 'medium', showNumber = false }: StarRatingProps) {
  const sizeMap = {
    small: '16px',
    medium: '20px',
    large: '24px'
  };

  const starSize = sizeMap[size];

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} style={{ color: '#FBBF24', fontSize: starSize }}>⭐</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" style={{ color: '#FBBF24', fontSize: starSize, opacity: 0.7 }}>⭐</span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} style={{ color: '#E5E7EB', fontSize: starSize }}>⭐</span>
      );
    }

    return stars;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex' }}>
        {renderStars()}
      </div>
      {showNumber && (
        <span style={{ fontSize: starSize, color: '#6B7280', fontWeight: '500' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}