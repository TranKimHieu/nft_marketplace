import { uploadFile } from "../entities";
import request from "./request";

export const uploadImage = (payload : uploadFile) => {
    return request.post('upload', payload)
}