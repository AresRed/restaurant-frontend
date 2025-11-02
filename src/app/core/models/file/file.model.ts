

export interface FileResponse {
  id: number;
  fileName: string;
  fileUrl: string;
  folder: string;
  uploadedById: number;
  uploadedByUsername: string;
  uploadDate: string;
  size: number;
  contentType: string;
}

export interface DeleteResponse {
  fileId: number;
  deletedById: number;
  deletedByUsername: string;
}
