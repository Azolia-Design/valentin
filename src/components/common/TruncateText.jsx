import { createEffect, onCleanup } from 'solid-js';

function truncateString(str, maxLength) {
  if (str.length > maxLength) {
      return [str.slice(0, maxLength - 3), '...'].join('');
  }
  return str;
}

const Truncate = (props) => {
  const { maxLines } = props;
  let refContainer;
  // Tính toán chiều dài tối đa cho mỗi dòng
  const lineHeight = 20; // Giả sử mỗi dòng chiếm khoảng 20px

  createEffect(() => {
    const child = props.children;
    if (!child || !child.style) return;
    console.log("run")

    // Đặt chiều cao tối đa cho phần tử con
    child.style.maxHeight = '7.04rem';
    console.log(refContainer.scrollHeight);
    console.log(refContainer.offsetHeight)
    // Kiểm tra xem liệu phần tử con có vượt quá chiều cao tối đa hay không
    if (refContainer.scrollHeight > refContainer.offsetHeight) {
      // Nếu có, cắt xén văn bản và thêm dấu "..."
      child.innerText = truncateString(child.innerText, refContainer.offsetWidth / 10);
    }

    // Cleanup on unmount
    onCleanup(() => {
      child.style.maxHeight = null; // Xóa chiều cao tối đa để tránh ảnh hưởng đến layout
    });
  });

  return <div ref={refContainer}>{props.children}</div>;
};
export default Truncate;