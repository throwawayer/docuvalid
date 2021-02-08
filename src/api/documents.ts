import client from 'api/client';
import { AxiosResponse } from 'axios';
import { GetDocumentsParams, SuccessfulResponseData, ValidateRequestParams } from 'models/DocumentsModel';

export const getDocuments = (params: GetDocumentsParams): Promise<AxiosResponse<SuccessfulResponseData>> =>
  client.get(`/documents?perPage=${params.perPage}&page=${params.page}`);

export const validateChecksum = (params: ValidateRequestParams): Promise<AxiosResponse<{ valid: boolean }>> =>
  client.post(`/documents/${params.id}/validateChecksum`);

export const validateSchema = (params: ValidateRequestParams): Promise<AxiosResponse<{ valid: boolean }>> =>
  client.post(`/documents/${params.id}/validateSchema`);

export const validateSignature = (params: ValidateRequestParams): Promise<AxiosResponse<{ valid: boolean }>> =>
  client.post(`/documents/${params.id}/validateSignature`);
