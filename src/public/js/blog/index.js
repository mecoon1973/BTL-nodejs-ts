function onClickReply(data) {
  const comment = JSON.parse(data);
  $('#parentId').val(comment.id); // Phần tử này được sử dụng để lưu trữ ID của bình luận cha (nếu có) cho phần tử bình luận mới sẽ được tạo ra.
  $('#comment-content-input').focus(); // dua con tro den truong nhap noi dung
  $('body').scrollTo('#comment-content-input'); // cuan trang den truong nhap noi dung
}
function onClickLike(data) {
  const comment = JSON.parse(data);
  const likeEl = $(`#like-${comment.id}`);// dung de luu tru cac phan tu html tuog ung 
  const unlikeEl = $(`#unlike-${comment.id}`);
  $.ajax({ // tao yeu cau ajax đến đuong dẫn => đường dẫn xđ bình luan thuc hien hd thich 
    url: `/comment/${comment.id}/like`,
    type: 'POST',
    success: function (data) {
      likeEl.text(data.likeCount);
      unlikeEl.text(data.unlikeCount);
      //ập nhật số lượng lượt thích và số lượng lượt không thích của bình luận trên giao diện bằng cách thay đổi nội dung của phần tử có id tương ứng (likeEl và unlikeEl).
    },
  });
}
function onClickUnlike(data) {
  const comment = JSON.parse(data);
  const likeEl = $(`#like-${comment.id}`);
  const unlikeEl = $(`#unlike-${comment.id}`);
  $.ajax({
    url: `/comment/${comment.id}/unlike`,
    type: 'POST',
    success: function (data) {
      likeEl.text(data.likeCount);
      unlikeEl.text(data.unlikeCount);
    },
  });
}
