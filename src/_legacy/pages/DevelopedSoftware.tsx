import React, { useState } from 'react';
import { useTranslation } from '../utils/i18n';
import { useLanguage } from '../utils/i18n';
import Modal from '../components/Modal';
import enSoftwareData from '../data/software-data-en.json';
import svSoftwareData from '../data/software-data-sv.json';

interface Software {
  name: string;
  description: string;
  images: string[];
  downloadLink: string;
}

const DevelopedSoftware: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const softwareData: { software: Software[] } = language === 'en' ? enSoftwareData : svSoftwareData;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(t('copied_to_clipboard'));
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="developed-software">
      <h1>{t('downloads')}</h1>
      {softwareData.software.map((software, index) => (
        <div key={index} className="software-item">
          <h2>{software.name}</h2>
          <div className="image-gallery">
          {software.images.map((image, imgIndex) => (
            <img
              key={imgIndex}
              src={`/images/software/${image}`}
              alt={`${software.name} screenshot ${imgIndex + 1}`}
              className="gallery-image"
              onClick={() => openModal(`/images/software/${image}`)}
            />
          ))}
        </div>
          <p>{software.description}</p>
          <a href={software.downloadLink} download>{t('download')}</a>
        </div>
      ))}
      <div className="appreciation-section">
        <p>{t('appreciation_message')}</p>
        <div className="wallet-address">
          <span>Solana: 3VAhM8uZjHr8bF8zpkTgt97VC4RjhbRYt1z6VFRMApy2</span>
          <button onClick={() => copyToClipboard('3VAhM8uZjHr8bF8zpkTgt97VC4RjhbRYt1z6VFRMApy2')}>
            {t('copy')}
          </button>
        </div>
        <div className="wallet-address">
          <span>EVM-compatible Polygon/ETH/and so on: 0x3ff91726fe4f71ab3bfcbc62e410fd660eca1c4c</span>
          <button onClick={() => copyToClipboard('0x3ff91726fe4f71ab3bfcbc62e410fd660eca1c4c')}>
            {t('copy')}
          </button>
        </div>
      </div>
      <Modal isOpen={!!selectedImage} onClose={closeModal} isImageModal={true}>
        {selectedImage && (
          <img src={selectedImage} alt="Expanded View" className="expanded-image" />
        )}
      </Modal>
    </div>
  );
};

export default DevelopedSoftware;