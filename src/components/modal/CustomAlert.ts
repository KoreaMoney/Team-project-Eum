import Swal from 'sweetalert2';

/**
 * @description 커스텀 컨펌 입니다.
 * @param {string} title 타이틀
 * @param {string} text 내용
 * @param {string} confirmButton 확인 버튼 텍스트
 * @param {Function} confirmed 확인 후 동작할 함수
 */
export const customConfirm = (
  title: string,
  text: string,
  confirmButton: string,
  confirmed: Function
) => {
  Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmButton,
    cancelButtonText: '취소',
    // id값이 맞아야 삭제가 되는데.....
  }).then((result: any) => {
    if (result.isConfirmed) {
      confirmed();
    }
  });
};

/**
 * @description 커스텀 alert 입니다.
 * @param {string} title 타이틀
 */
export const customSuccessAlert = (title: string) => {
  Swal.fire({
    icon: 'success',
    title: title,
    confirmButtonColor: '#3085d6',
  });
};

export const customWarningAlert = (title: string) => {
  Swal.fire({
    icon: 'warning',
    title: title,
    confirmButtonColor: '#3085d6',
  });
};

export const customInfoAlert = (title: string) => {
  Swal.fire({
    icon: 'info',
    title: title,
    confirmButtonColor: '#3085d6',
  });
};
