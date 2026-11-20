import { PHOTO_RULES } from './config';

export function checkPhotoFile(file) {
  if (!PHOTO_RULES.accepted.includes(file.type)) {
    return `«${file.name}» no es una imagen válida. Usa JPG, PNG o WebP.`;
  }
  if (file.size > PHOTO_RULES.maxBytes) {
    return `«${file.name}» supera los ${PHOTO_RULES.maxBytes / 1024 / 1024} MB permitidos.`;
  }
  return '';
}

export function photoId(file) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`No se pudo leer «${file.name}».`));
    reader.readAsDataURL(file);
  });
}