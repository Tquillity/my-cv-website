// src/components/ImageGallery.tsx
import React, { useState } from 'react';
import Modal from './Modal'; // You'll create this next

interface ImageGalleryProps {
  images: string[]; // Array of image URLs
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="image-gallery">
      <div className="image-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Gallery Image ${index + 1}`}
            className="gallery-image"
            onClick={() => openModal(image)}
          />
        ))}
      </div>
      <Modal isOpen={!!selectedImage} onClose={closeModal}>
        {selectedImage && (
          <img src={selectedImage} alt="Expanded View" className="expanded-image" />
        )}
      </Modal>
    </div>
  );
};

export default ImageGallery;