/* eslint-disable no-undef */
(function main() {
  const postCommentBtn = document.querySelectorAll('.post__new-comment button');

  postCommentBtn.forEach((btn) => {
    btn.onclick = async () => {
      if (!btn.dataset.auth) {
        window.location.replace('/signin');
        return;
      }
      const commentBody = btn.previousSibling;
      const { postId } = commentBody.dataset;
      const body = commentBody.value;
      if (body === '') return;
      const res = await fetch('/api/new-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          body,
        }),
      });
      if (res.ok) {
        btn.textContent = 'post';
        commentBody.value = '';
        const comment = document.createElement('p');
        const cmtUser = document.createElement('span');
        comment.classList.add('post__comment');
        cmtUser.classList.add('post__comment-username');
        cmtUser.append(_authUserHandle);
        comment.append(cmtUser);
        comment.append(body);
        const footer = btn.parentNode.parentNode;
        footer.insertBefore(comment, btn.parentNode);
      } else {
        btn.textContent = 'retry';
      }
    };
  });
}());
