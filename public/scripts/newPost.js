/* eslint-disable no-undef */
(function main() {
  async function uploadFile(file, signedRequest, imgUrl, imageUid) {
    const res = await fetch(signedRequest, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    if (res.ok) {
      const preview = document.querySelector('.post-form__preview');
      const imgUidInput = document.querySelector('#img-uid');
      // set hidden imageUrl and imageUid input for posting to new-post
      imgUidInput.value = imageUid;
      /*  replace placeholder to the actual image from s3 */
      preview.innerHTML = '';
      const img = document.createElement('img');
      img.src = imgUrl;
      img.altText = 'preview of image';
      preview.append(img);
    }
  }

  async function getSignedRequest(file) {
    const res = await fetch(`/api/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    if (res.ok) {
      const data = await res.json();
      uploadFile(file, data.signedRequest, data.url, data.imageUid);
    }
  }

  const uploader = document.querySelector('#file-upload');
  uploader.onchange = () => {
    const file = uploader.files[0];
    if (file === null) {
      return;
    }
    getSignedRequest(file);
  };
}());
