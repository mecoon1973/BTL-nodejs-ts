export interface ICreateCommentDto {
  email?: string;
  userName?: string;
  content: string;
  authorId?: number;
  anonymousId?: number; //id nguoi dung an danh 
  isIncognito: number; // trang thai an danh cua binh luan 0-1
  postSlug: string; // duong dan bai viet lien quan den binh luan
  token?: string; // mã thông báo xác định nguoi dung binh luan 
  parentId?: number; // id binh luan cha 
}
// comment
